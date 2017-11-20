import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NameValue} from '../../app/name-value';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-grouptoggler',
  templateUrl: './grouptoggler.component.html',
  styleUrls: ['./grouptoggler.component.css']
})
export class GrouptogglerComponent implements OnInit {
 @Input() toggleValues: NameValue[];
 @Input() toggleList: NameValue[];
 @Input() theFormArray: FormArray;
 @Output() onHeadToggle = new EventEmitter<string>();

  constructor() { }
  ngOnInit() {}


allRoles(nr: string) {
  this.onHeadToggle.emit(nr);
}

createForm() {
  this.toggler =this.fb.group({

  })
}

}
