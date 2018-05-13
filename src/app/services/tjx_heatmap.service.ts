import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
@Injectable()
export class TjxHeatMapService {
    private baseURL = environment.baseBZURI;
    private getTjxHeatMApURL = this.baseURL + '/api-tjx/heatMapData';
    constructor(private http: Http) { }
    
    getTjxHeatMapData() {
        let _getTjxHeatMApURL = this.getTjxHeatMApURL;
        _getTjxHeatMApURL = _getTjxHeatMApURL + '?startDate=2018-04-20' + '&endDate=2018-04-22' + '&storeId=TJXM1299';
        console.log(_getTjxHeatMApURL);
        //let options = new RequestOptions({ headers: headers });
        return this.http.get(_getTjxHeatMApURL)
            .pipe(map((response: Response) => {
                let data = response.json();
                console.log(data);
                return data;
            })).pipe(catchError((error: any) => Observable.throw(error.json().error || 'server error')));

    }
}
