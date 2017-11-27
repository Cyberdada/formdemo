import {
  Component, Input, ViewChild, ElementRef, OnInit,
  AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';

import { MatList, MatListItem, MatButton, MatIcon, MatCheckbox, MatCard } from '@angular/material';
import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';

import { defaultEmptyImage } from './emptyimage';

// TODO
// Add resize/ cropping
// see
// http://www.bestjquery.com/2014/11/resizing-cropping-images-html5-canvas/
// https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
// https://github.com/danschumann/limby-resize/blob/master/lib/canvas_resize.js
// https://github.com/nodeca/pica
//

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

  @ViewChild('theCanvas') canvasRef: ElementRef;
  @ViewChild('fileInput') fileInputRef: ElementRef;

  private imageValue: string;
  private canvas: any;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;
  private tempData: ImageData;
  img: HTMLImageElement;

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
   // const each100MilliSecond$ = Observable.interval(600);
    const mouseDown$ = Observable.fromEvent(this.canvas, 'mousedown');
    const mouseMove$ = Observable.fromEvent(this.canvas, 'mousemove');
    const mouseUp$ = Observable.fromEvent(this.canvas, 'mouseup');

    const mousedrag$ =  mouseDown$.flatMap(function (md: MouseEvent) {

            const startX = md.clientX, startY  = md.clientY;
            return mouseMove$.map(function (mm: any) {
              mm.preventDefault();
              return {
                left:  startX - mm.clientX ,
                top: startY - mm.clientY
              };
            }).takeUntil(mouseUp$);
          });

this.dragSubscription = mousedrag$.subscribe(event => {
  this.xPos =  this.xPos  +  (event.left / 4) ;
  this.yPos =  this.yPos  + (event.top / 4) ;
  this.updatePositionScale();

});
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
        this.updatePositionScale();
        // Need to clean out files from file input,
        // otherwise file dialog will not appear after backtracking
        this.fileInputRef.nativeElement.value = '';
        this.imageValue = this.canvas.toDataURL(this.resImageType, this.resQuality);
        this.propagateChange(this.imageValue);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
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


  eatKey(event: KeyboardEvent) {

    switch (event.keyCode) {
      case UP_ARROW:
        this.yPos += 5;
        this.updatePositionScale();
        break;
      case DOWN_ARROW:
        this.yPos -= 5;
        this.updatePositionScale();
        break;
      case LEFT_ARROW:
        this.xPos += 5;
        this.updatePositionScale();
        break;
      case RIGHT_ARROW:
        this.xPos -= 5;
        this.updatePositionScale();
        break;
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
