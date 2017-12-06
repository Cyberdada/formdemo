import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import {
  FormArray, FormControl, FormGroup, FormBuilder, Validators,
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule
} from '@angular/forms';

import {NameValue} from '../../app/name-value';
import {ToggleItem} from './toggle-item.model';

interface Iwidth {
  width: number;
}

@Component({
  selector: 'app-grouptoggler',
  templateUrl: './grouptoggler.component.html',
  styleUrls: ['./grouptoggler.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting:  GrouptogglerComponent, multi: true }
  ]
})
export class GrouptogglerComponent implements OnInit, ControlValueAccessor {
  @Input() toggleValues: NameValue[] = [{name: 'None', value: 0 }, {name: 'Editor', value: 1 }, {name: 'Admin', value: 2 } ];
  @Input() width= -1;
  @Input() rowsHeight = 300;
  @Input() headers = [{name: 'Name', width: 140} , {name: 'Role', width: 0}];
  @Input() fields = ['name'];
  toggleItems: ToggleItem[] = [];
  toggler: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

calcWidth() {
  const DEFAULT_TOGGLEBUTTON_LENGTH = 80;

  return this.width > -1
    ? this.width
    : this.toptogglePadding() + (this.toggleValues.length * DEFAULT_TOGGLEBUTTON_LENGTH );

}

  toptogglePadding() {
    const DEFAULT_HEAD_LEFTMARGIN = 16;

    return this.headers.reduce(( tutti: number, b: Iwidth) => tutti + b.width, 0) + DEFAULT_HEAD_LEFTMARGIN;
  }

  allRoles(nr: string) {
    this.formRoles.controls.forEach( itm => (itm as FormGroup).controls['role'].setValue(nr) );
  }

  createForm() {
    this.toggler = this.fb.group({
      roles: this.fb.array([])
    });
  }

  get formRoles(): FormArray {
    return this.toggler.get('roles') as FormArray;
  }

  // Form Control Code
  writeValue(val: ToggleItem[]) {
    this.toggleItems = val;
    const p  = this.toggleItems.map(itm => this.fb.group({ id: itm.id, role: itm.role , extId: itm.extId }));
    this.toggler.setControl('roles', this.fb.array(p));
  }

  registerOnChange(fn) {
    this.toggler.valueChanges.subscribe(fn);
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.toggler.disable()
             : this.toggler.enable();
  }

  registerOnTouched() { }

}
