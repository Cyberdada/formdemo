import { Component, OnInit, Input, Output, EventEmitter, OnChanges, forwardRef, SimpleChange } from '@angular/core';
import { NameValue } from '../../app/name-value';
import {
  FormArray, FormControl, FormGroup, FormBuilder, Validators,
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-grouptoggler',
  templateUrl: './grouptoggler.component.html',
  styleUrls: ['./grouptoggler.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GrouptogglerComponent), multi: true }
  ]
})
export class GrouptogglerComponent implements OnInit, OnChanges {
  @Input() toggleValues: NameValue[];
  @Input() toggleList: any[];

  value: any;
  toggler: FormGroup;
  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.toggleList.currentValue !== undefined) { this.allRoles('0'); }
  }

  allRoles(nr: string) {
    const p = this.toggleList.map(project => this.fb.group({ id: 0, role: nr, pid: project.id }));
    const parr = this.fb.array(p);
    this.toggler.setControl('roles', parr);
    this.propagateChange(this.toggler.value);
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
  writeValue(val: any) {
   val && this.toggler.setValue(val, { emitEvent: false });
  }
  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.toggler.disable()
             : this.toggler.enable();
  }

  registerOnTouched() { }

}
