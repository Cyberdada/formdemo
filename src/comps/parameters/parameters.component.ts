import { Component, OnInit } from '@angular/core';
import {
  FormArray, FormControl, FormBuilder, FormGroup, Validators,
  ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule, AbstractControl
} from '@angular/forms';

import {
  MatList, MatListItem, MatButton, MatIcon, MatRadioGroup, MatRadioButton,
  MatButtonToggleGroup, MatButtonToggle
} from '@angular/material';
import { Validator } from '@angular/forms/src/directives/validators';


@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ParametersComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: ParametersComponent, multi: true }
  ]
})
export class ParametersComponent implements OnInit, ControlValueAccessor, Validator {

  paramGroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  validate(ctrl: AbstractControl) {
    if (this.paramGroup.invalid) {
      return { validateName: { valid: false } };
    }
    return null;

    // Doing it by hand, messier, but something like this would be needed
    // if you where to do your custom validation,
    // for instance if one of your child controls would be dependent on the
    // value of another



    // if (ctrl.value === '') { return null; }

    // const retval = ctrl.value.parameters.some(itm => itm.name === '');
    // if (retval) {
    //   return { validateName: { valid: false } };
    // }

  }

  createForm() {
    this.paramGroup = this.fb.group({
      parameters: this.fb.array([])
    });
  }

  addParameter(id: number, name: string, type: string, value: string) {

    this.formParameters.push(
      this.fb.group({ name: [name, Validators.required], id: id, type: parseInt(type, 10), value: value }));

  }

  removeParameter(ix: number) {
    this.formParameters.removeAt(ix);
  }

  get formParameters(): FormArray {
    return this.paramGroup.get('parameters') as FormArray;
  }

  paraDisplay(itm: any): string {
    if (itm === 0) { return 'number'; }
    if (itm === 1) { return 'string'; }
    if (itm === 2) { return 'boolean'; }
  }

  // Form Control Code
  writeValue(val: any) {
    val && this.paramGroup.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn) {
    this.paramGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched() { }
}
