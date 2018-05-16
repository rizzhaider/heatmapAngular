import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class AuthenticationService {

  constructor(private http:Http, 
               private userService : UserService) { }

  private baseUrl = environment.baseBZURI;
  private loginUrl = this.baseUrl + '/tjx/authentication';
  

  login(username: string, password:string){
     let authObjectData = {
       userName: username,
       password:password
     };

     let authObject = {Data: authObjectData};


     return this.http.post(this.loginUrl, JSON.stringify(authObject))
        .map((response:Response) => {

           let data = response.json();
           if(data){
             if(data === "Authenticated"){
               this.userService.saveUser(data.UserId);
             }
           }
           return data;

        }).catch((error:any) => Observable.throw(error.json().error || 'Server error'));   
            
     

  }

  logoutLocally(){
    
    this.userService.clearUser();

  }


}
