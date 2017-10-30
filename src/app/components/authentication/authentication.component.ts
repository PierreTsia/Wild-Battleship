import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  userName: string;
  email: string;
  password: string;
  errorMailAlreadyUse = false;

  constructor(public authService: AuthService) { }

  clearErrors() {
    this.errorMailAlreadyUse = false;
  }

  signup() {
    this.clearErrors()
    this.authService.signup(this.userName, this.email, this.password, (errorCode) => {
      console.log(errorCode);
      if (errorCode == "auth/email-already-in-use") {
        this.errorMailAlreadyUse = true;
      }
    });
    this.email = this.password = '';
    console.log(this.userName)
  }

  login() {
    this.clearErrors()
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }

  logout() {
    this.authService.logout();
  }
  googleLogin() {
    this.clearErrors()
    this.authService.googleLogin();
  }
  facebookLogin() {
    this.clearErrors()
    this.authService.facebookLogin();
  }


  ngOnInit() {
    
  }

}
