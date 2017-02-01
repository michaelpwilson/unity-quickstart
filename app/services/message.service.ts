import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import '../config/operators';

@Injectable()
export class MessageService {
  private _create   = 'message/create';
  private _destroy  = 'message/destroy?id='; 
  private _find     = 'message/find';
  private _including = 'message/including?id=';

  constructor (private http: Http) {}

  find(example: Object): Observable<any> {
    return this.http.get(this._find + this.serialize(example) ).map(this.extractData).catch(this.handleError);
  }

  including(data: any): Observable<any> {
    return this.http.get(this._including + "" + data.id).map(this.extractData).catch(this.handleError);
  }

  create(example: Object): Observable<any> {
    return this.http.post(this._create, example).map(this.extractData).catch(this.handleError);
  }

  destroy(id: number): Observable<any> {
    return this.http.post(this._destroy + "" + id, {}).map(this.extractData).catch(this.handleError);
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