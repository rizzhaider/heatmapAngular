import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
const httpOptions = {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization':  'Basic '+btoa('hughes:hughes')
                  })
                };

@Injectable()
export class AuthenticationService {

  constructor(private http:HttpClient, 
               private userService : UserService) { 
               }

  private baseUrl = environment.baseURL;
  private loginUrl = this.baseUrl + '/tjx/authentication';
  

  login(username: string, password:string){
     let authObject = {
       userName: username,
       password:password,
       state:"login"
     };
    console.log(authObject);
   

    //let options = new RequestOptions({ headers: httpOptions });
     return this.http.post(this.loginUrl, JSON.stringify(authObject), httpOptions)
        .pipe( 
          tap( 
            data => {             
              console.log(data);
              if(data){
                if(data === "authenticated"){
                 this.userService.saveUser();                 
                }
              }
            }
        )).pipe(catchError((error: any) => Observable.throw(error.json().error || 'server error')));  
            
     

  }

  logoutLocally(){
    
    this.userService.clearUser();

  }


}
