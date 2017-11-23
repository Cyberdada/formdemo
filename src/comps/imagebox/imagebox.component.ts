import { Component, Input, ViewChild, ElementRef, OnInit,
  AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatList, MatListItem, MatButton, MatIcon, MatCheckbox, MatCard, MatSlider, MatGridList } from '@angular/material';


import {defaultEmptyImage} from './emptyimage';
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
export class ImageboxComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit  {
  @Input() emptyImage = defaultEmptyImage;
  @Input() width =  200;
  @Input() height =  200;
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

  rgbSliders = [0, 0, 0];
  xPosSlider = 0;
  yPosSlider = 0;
  xScaleSlider = 0;
  yScaleSlider = 0;
  changed = false;
  changeRgb = false;
  keepAspectRatio = false;

  constructor() {}

  ngOnInit() {
    this.img = new Image();
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
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
         this.context.clearRect(0, 0,  this.width, this.height);
         this.context.drawImage(this.img, 0, 0, this.width, this.height);

        // Need to clean out files from file input,
        // otherwise file dialog will not appear after backtracking
        this.fileInputRef.nativeElement.value = '';
        this.imageValue = this.canvas.toDataURL(this.resImageType, this.resQuality);
        this.propagateChange( this.imageValue);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);

      };
    };
    return false;
  }

  eatKey(event: any) {
    console.log(event);
  }

// Rgb related stuff
showRgb() {
  // need this to be able to alter the image without messing with the original.
  // note if not explicitly copying the array, the original will be messed up, thus the slice
  this.tempData = new ImageData( this.imageData.data.slice(0), this.imageData.width, this.imageData.height );
  this.rgbSliders.fill(0);
  this.changeRgb = true;
}

cancelRgb() {
  this.changeRgb = false;
   this.resetSliders();
}

updateColor() {
  for (let i = 0; i < this.width * this.height * 4; i += 4) {
            this.imageData.data[i] = this.tempData.data[i] + this.rgbSliders[0];
            this.imageData.data[i + 1] = this.tempData.data[i + 1] + this.rgbSliders[1];
            this.imageData.data[i + 2] =  this.tempData.data[i + 2] + this.rgbSliders[2];
          }
          this.context.putImageData(this.imageData, 0, 0);
}


updatePositionScale() {
  this.context.drawImage(this.img, this.xPosSlider, this.yPosSlider, this.yScaleSlider, this.xScaleSlider,  0, 0, this.width, this.height);
}



applyRgb() {
  this.imageValue = this.canvas.toDataURL(this.resImageType, this.resQuality);
  this.propagateChange( this.imageValue);
  this.imageData = this.context.getImageData(0, 0, this.width, this.height);
  this.changeRgb = false;
}
resetSliders() {
  this.rgbSliders.fill(0);
  this.updateColor();
}

// end RgbRelated stuff

  backtrack() {
    this.draw();
    this.img.src = this.emptyImage;
    this.imageValue = '';
    this.changed = false;
    this.propagateChange(this.imageValue);
    this.changeRgb = false;
  }

  draw() {
    this.img.onload = () => {
      this.context.clearRect(0, 0,  this.width, this.height);
      this.context.drawImage(this.img, 0, 0);
    };
  }


  // Form Control Code
  writeValue(value: any) {
    this.img.src = value;
  }
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
