import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Httpbase } from './httpbase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

@Injectable()
export class ProjectService extends Httpbase {


  projectPath = '../assets/mockdata/project.json';
  constructor(protected http: HttpClient) { super(http); }


  projects() {
    return this.http.get(this.projectPath);
  }

}
