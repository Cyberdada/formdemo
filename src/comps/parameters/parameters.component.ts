import { Component, OnInit, Input } from '@angular/core';
import {
  FormArray, FormControl, FormBuilder, FormGroup, Validators,
  ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule, AbstractControl
} from '@angular/forms';


import { Validator } from '@angular/forms/src/directives/validators';
import {NameValue} from '../../app/name-value';

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
 @Input() paramTypes: NameValue[] = [{name: 'Number', value: 0 }, {name: 'String', value: 1 }, {name: 'Object', value: 2 }  ];
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

  typeByValue(nr: number) {
    return this.paramTypes.find(itm => itm.value === nr);
  }

  removeParameter(ix: number) {
    this.formParameters.removeAt(ix);
  }

  get formParameters(): FormArray {
    return this.paramGroup.get('parameters') as FormArray;
  }

  paraDisplay(itm: any): string {
    if ( isNaN(itm.value)) {return 'Not set'; }
    return itm ? itm.name : itm;
  }

  calcWidth() {
    // Currently just adds all the css values and the adds 100 to that.
    // A placeholder for a more intelligent function
    return  200 + 130 + 130 + 100;
  }
  // Form Control Code
  writeValue(val: any[]) {
    console.log(val);
    const p = val.map(itm => this.fb.group(
      { name: [itm.name, Validators.required], id: itm.id, type: this.typeByValue( parseInt(itm.type, 10) ), value: itm.value }));
      this.paramGroup.setControl('parameters', this.fb.array(p));
  }

  registerOnChange(fn) {
    this.paramGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched() { }
}
