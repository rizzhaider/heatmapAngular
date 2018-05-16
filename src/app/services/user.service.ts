import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { }


    saveUser(id: string):void{

      localStorage.setItem('currentUserId', id);
    }
    getUser(): string{
       return localStorage.getItem('currentUserId');
  }
       clearUser():void{
        localStorage.removeItem('currentUserId');
     
  }
  
  

}
