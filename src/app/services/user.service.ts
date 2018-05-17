import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { }


    saveUser():void{

      sessionStorage.setItem('heatmap_tjx_isLoggedIn',  'true');
    }
    getUser(): string{
       return sessionStorage.getItem('heatmap_tjx_isLoggedIn');
  }
       clearUser():void{
        sessionStorage.removeItem('heatmap_tjx_isLoggedIn');
     
  }
  
  

}
