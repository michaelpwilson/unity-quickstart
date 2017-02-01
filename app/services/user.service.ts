import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import '../config/operators';

@Injectable()
export class UserService {

  private _create     = 'user/create';
  private _getFriends = 'user/getFriends';
  private _destroy    = 'user/destroy?id='; 
  private _find       = 'user/find';
  private _login      = 'user/login';
  private _update     = 'user/update?id=';
  private api         = "";

  constructor (private http: Http) {}

  find(example: Object): Observable<any> {
    if(!example) example = {};

    return this.http.get(this._find, example).map(this.extractData).catch(this.handleError);
  }

  create(example: Object): Observable<any> {
    return this.http.post(this._create, example).map(this.extractData).catch(this.handleError);
  }

  getFriends(example: Object): Observable<any> {
    return this.http.post(this._getFriends, example).map(this.extractData).catch(this.handleError);
  }

  update(id: number, example: Object): Observable<any> {
    return this.http.post(this._update + "" + id, example).map(this.extractData).catch(this.handleError);
  }

  destroy(id: number): Observable<any> {
    return this.http.post(this._destroy + "" + id, {}).map(this.extractData).catch(this.handleError);
  }

  login(example: Object): Observable<any> {
    return this.http.post(this._login, example).map(this.extractData).catch(this.handleError);
  }

  private serialize( obj: Object ) {
    return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
  }

  private extractData(res: Response) {
    return res.json();
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}