import {
  Component, Input, ViewChild, ElementRef, OnInit, Output,
  AfterViewInit, OnChanges, SimpleChanges, EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { MatList, MatListItem, MatButton, MatIcon, MatCheckbox, MatCard } from '@angular/material';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

import { defaultEmptyImage } from './emptyimage';

// TODO
// Add resize can probably be of better quality, now just using default.
// see
// https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
// https://github.com/danschumann/limby-resize/blob/master/lib/canvas_resize.js
// https://github.com/nodeca/pica
// resize code inspired by  http://www.bestjquery.com/2014/11/resizing-cropping-images-html5-canvas/


@Component({
  selector: 'app-imagebox',
  templateUrl: './imagebox.component.html',
  styleUrls: ['./imagebox.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ImageboxComponent, multi: true }
  ]
})
export class ImageboxComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit {
  @Input() emptyImage = defaultEmptyImage;
  @Input() width = 200;
  @Input() height = 200;
  @Input() resImageType = 'image/jpeg';
  @Input() resQuality = .82;
  @Output() originSize = new EventEmitter();
  @Output() position = new EventEmitter();

  @ViewChild('theCanvas') canvasRef: ElementRef;
  @ViewChild('fileInput') fileInputRef: ElementRef;

  private imageValue: string;
  private canvas: any;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;
  private tempData: ImageData;
  img: HTMLImageElement;
  keys = [
    { key: UP_ARROW, x: 0, y: 5 },
    { key: DOWN_ARROW, x: 0, y: -5 },
    { key: LEFT_ARROW, x: 5, y: 0 },
    { key: RIGHT_ARROW, x: -5, y: 0 }];
  xPos = 0;
  yPos = 0;
  minScale = 1;
  maxScale = 3;
  scale = 3;
  scaleStep = 0.1;
  originIsSmaller = false;
  changed = false;
  dragSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.img = new Image();
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
    const mouseDown$ = Observable.fromEvent(this.canvas, 'mousedown');
    const mouseMove$ = Observable.fromEvent(this.canvas, 'mousemove');
    const mouseUp$ = Observable.fromEvent(this.canvas, 'mouseup');

    const mousedrag$ = mouseDown$.flatMap(function (md: MouseEvent) {

      const startX = md.clientX, startY = md.clientY;
      return mouseMove$.map(function (mm: any) {
        mm.preventDefault();
        return {
          left: startX - mm.clientX,
          top: startY - mm.clientY
        };
      }).takeUntil(mouseUp$);
    });

    this.dragSubscription = mousedrag$.subscribe(event => {
      if (this.changed) {
        this.xPos = this.xPos + (event.left / 4);
        this.yPos = this.yPos + (event.top / 4);
        this.updatePositionScale();
      }
    });
  }

  sliderChanged(event) {
    this.scale = event.value;
    this.updatePositionScale();
  }
  ngAfterViewInit() {
    this.img.src = this.emptyImage;
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userImage'] && changes['userImage'].firstChange === false) {
      this.img.src = changes['userImage'].currentValue;
    }
  }

  gotFiles(fileInput: any) {
    // Guard
    if (fileInput.target.files.length === 0) { return; }

    this.changed = true;
    const file = fileInput.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: Event) => {
      const target: any = e.target;
      this.img.src = target.result;
      this.img.onload = () => {
        this.calculateScale();
        this.xPos = 0;
        this.yPos = 0;
        this.scale = this.maxScale;
        // Need to clean out files from file input,
        // otherwise file dialog will not appear after backtracking
        this.fileInputRef.nativeElement.value = '';
        this.updatePositionScale();
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.originSize.emit({ width: this.img.width, height: this.img.height });
        this.position.emit({ x: this.xPos, y: this.yPos });
      };
    };
    return false;
  }

  backtrack() {
    this.draw();
    this.img.src = this.emptyImage;
    this.imageValue = '';
    this.changed = false;
    this.propagateChange(this.imageValue);
  }

  updatePositionScale() {
    this.context.clearRect(0, 0, this.width, this.height);
    const coords = this.setDestCoords();
    this.context.drawImage(this.img, this.xPos, this.yPos, coords.sWidth, coords.sHeight,
      0, 0, coords.dWidth, coords.dHeight);

    this.imageValue = this.canvas.toDataURL(this.resImageType, this.resQuality);
    this.propagateChange(this.imageValue);

  }

  private setDestCoords() {
    return this.originIsSmaller
      ? { sWidth: this.img.width, sHeight: this.img.height, dWidth: this.img.width * this.scale, dHeight: this.img.height * this.scale }
      : { dWidth: this.img.width, dHeight: this.img.height, sWidth: this.img.width * this.scale, sHeight: this.img.height * this.scale };
  }


  private calculateScale() {
    // Computation does not take into account images that have extremly uneven x / y values
    // (ie height of 100 and width of 1000)
    const xscale = this.img.height / this.height;
    const yscale = this.img.width / this.width;

    this.maxScale = xscale <= yscale ? xscale : yscale;

    this.originIsSmaller = this.maxScale < 1 ? true : false;

    if (this.originIsSmaller) {
      this.maxScale = 1 / this.maxScale;
    }
    this.minScale = this.maxScale / 3;
    this.scaleStep = (this.maxScale - this.minScale) / 100;
  }

  eatMousewheel(event: MouseWheelEvent) {
    if (this.changed) {
      switch (event.deltaY) {
        case 100:
          this.scale += this.scaleStep * 3;
          break;
        case -100:
          this.scale -= this.scaleStep * 3;
          break;
      }
      this.updatePositionScale();
    }
  }

  eatKey(event: KeyboardEvent) {
    if (this.changed) {
      const movement = this.keys.find(itm => itm.key === event.keyCode);
      if (movement) {
        this.xPos += movement.x;
        this.yPos += movement.y;
        this.position.emit({ x: this.xPos, y: this.yPos });
        this.updatePositionScale();
      }
    }
  }

  draw() {
    this.img.onload = () => {
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.drawImage(this.img, 0, 0);
    };
  }

  // Form Control Code
  writeValue(value: any) { this.img.src = value; }
  propagateChange = (_: any) => { };
  registerOnChange(fn) { this.propagateChange = fn; }
  registerOnTouched() { }
}
