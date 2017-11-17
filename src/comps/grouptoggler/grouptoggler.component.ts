import { Component, OnInit, Input } from '@angular/core';
import {NameValue} from '../../app/name-value';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-grouptoggler',
  templateUrl: './grouptoggler.component.html',
  styleUrls: ['./grouptoggler.component.css']
})
export class GrouptogglerComponent implements OnInit {
 @Input() toggleValues: NameValue[];
 @Input() toggleList: NameValue[];
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  allRoles(nr: string) {
    const p = this.toggleValues.map(itm => this.fb.group({ id: 0, role: nr, pid: itm.value }));
    const parr = this.fb.array(p);
    this.userForm.setControl('roles', parr);
  }

}



