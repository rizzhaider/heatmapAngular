import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  login(form: NgForm) {
    
    const _username = form.value.username;
    const _password = form.value.password;

    this.authenticationService.login(_username, _password)
    .subscribe(
                data => {
                   console.log('Received login response', data);
                    if (data.success) {
                        this.router.navigate(['home']);
                    } else {
                      
                        console.log(data.errorMsg);
                    }
                },
       error => {
              
              console.log('Server Error');
              console.log(error);

       });

  }
}
