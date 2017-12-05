import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import {
  FormArray, FormControl, FormGroup, FormBuilder, Validators,
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule
} from '@angular/forms';

import {NameValue} from '../../app/name-value';
import {ToggleItem} from './toggle-item.model';


@Component({
  selector: 'app-grouptoggler',
  templateUrl: './grouptoggler.component.html',
  styleUrls: ['./grouptoggler.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting:  GrouptogglerComponent, multi: true }
  ]
})
export class GrouptogglerComponent implements OnInit, ControlValueAccessor {
  @Input() toggleValues: NameValue[];
  @Input() fieldWidth = 140;
  @Input() width= 390;
  @Input() rowsHeight = 300;
  @Input() headers = ['Name', 'Role'];
  @Input() fields = ['name'];
  toggleItems: ToggleItem[] = [];
  toggler: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.toggler.valueChanges.subscribe( itm => {console.log(itm)});
  }


  allRoles(nr: string) {
    this.formRoles.controls.forEach(
      itm => (itm as FormGroup).controls['role'].setValue(nr) );
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
