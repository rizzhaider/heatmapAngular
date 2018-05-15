import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class TjxMinMaxDateService {
    private baseURL = environment.baseBZURI;
    private getTjxMinMaxDateURL = this.baseURL + '/api-tjx/max-min-date';
    constructor(private http: Http) { }    
    getTjxMinMaxDate(storeId:any) {
        console.log(storeId);
        let _getTjxMinMaxDateURL = this.getTjxMinMaxDateURL;
        _getTjxMinMaxDateURL = _getTjxMinMaxDateURL + '?storeId=' + storeId;
        console.log(_getTjxMinMaxDateURL);
        //let options = new RequestOptions({ headers: headers });
        return this.http.get(_getTjxMinMaxDateURL)
            .pipe(map((response: Response) => {
                let data = response.json();
                console.log(data);
                return data;
            })).pipe(catchError((error: any) => Observable.throw(error.json().error || 'server error')));

    }
}
