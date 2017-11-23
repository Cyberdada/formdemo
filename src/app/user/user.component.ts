import { Component, OnInit } from '@angular/core';
import { MatList, MatListItem, MatButton, MatIcon } from '@angular/material';
import {MatCard} from '@angular/material/card';
import {MatGridList} from '@angular/material/grid-list';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ProjectService } from '../project.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ProjectService]
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  // projects: any[];
  formvalue: any;
  toggleValues = [{name: 'None', value: 0 }, {name: 'Editor', value: 1 }, {name: 'Admin', value: 2 } ];
  constructor(private fb: FormBuilder, private projectService: ProjectService) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      userImage: [''],
      information: this.fb.group({
        nickName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: [, Validators.required],
        middleName: '',
        email: ''
      }),
      toggler: [[]],
      parameters: ['']
    });

    this.projectService.projects().subscribe( (retval: any[] ) => {
      this.userForm.controls.toggler.patchValue(
         retval.map(itm =>  ({ id: 0, role: 0, projectId: itm.id, name: itm.name}))
        );
      // this.projects = retval;
    });
  }




  save() {
    this.formvalue = JSON.stringify(this.userForm.value);
  }

  cancel() {

  }

}
