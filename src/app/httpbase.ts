import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

export class Httpbase {

  constructor(protected http: HttpClient) { }

  protected get(path: string) {
    return this.http.get(path)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Object): any {
    return res;
  }

  private handleError(error: any) {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    const mymsg = JSON.parse(error._body).error.message;
    return Observable.throw(mymsg);
  }
}
