import { Component, OnInit } from '@angular/core';

import { AuthService as ngXAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean;
 
  constructor(private authService: ngXAuthService, private auth: AuthService) { }
 
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(sUser => {
      this.auth.loginWithGoogle(sUser.authToken, sUser.idToken).subscribe(resp => {
        console.log(resp);
      });
    })
  }

}
