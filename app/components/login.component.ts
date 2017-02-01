import { Component, Inject, OnInit} from '@angular/core';
import { Router } 					        from '@angular/router';
import { UserService } 			        from '../services/user.service';

declare const FB:any;

@Component({
  selector: 'login',
  template: `
    <div *ngIf="!sociallyLoggedIn">
      <h3 class="u-mt0">Login with:</h3>
      <button class="bg--facebook" (click)="fbLogin()"><i class="fa fa-facebook-official" aria-hidden="true"></i> Facebook</button>
      <button class="bg--twitter"><i class="fa fa-twitter" aria-hidden="true"></i> Twitter</button>
      <button class="bg--google"><i class="fa fa-google" aria-hidden="true"></i> Google</button>

      <h4 class="or">Or</h4>
    </div>

    <form class="form--login" #loginForm="ngForm" (submit)="loginSubmit()">
      <input placeholder="Email address" name="email" type="email" [(ngModel)]="login.email">
      <input placeholder="password" name="password" type="password" [(ngModel)]="login.password">

      <label class="remember">
        <input name="remember" type="checkbox">
        Remember me
      </label>
      <button type="submit">Login</button>
    </form>
  `,
})
export class LoginComponent implements OnInit {
  newUser: any = {};
  userFbDetails: any = {};
  errorMessage: any;
  login: any = { email: "", password: "" };
  sociallyLoggedIn: any;

  constructor(
  	@Inject(UserService)  private _userService: UserService,
  	@Inject(Router) 		  private router: Router
  ) { }
  
  statusChangeCallback(resp: any) {
    this._userService.find({fb_id: resp.authResponse.userID})
	  	.subscribe(
    		(user) => {
        	if(!user) {
        		this.router.navigate(['/signup']);
        	} else {
    			this.login.email = user.email;
        	}
  		  },
        error => this.errorMessage = <any>error
      );
  };
  ngOnInit() {
    FB.getLoginStatus(response => {
  		this.sociallyLoggedIn = true;
        this.statusChangeCallback(response);
    });
  }
  loginSubmit() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          this.login.location = [ position.coords.longitude,  position.coords.latitude].toString();

          this._userService.login(this.login)
            .subscribe(
              (status) => {
                if(!status.result) {
                  // error
                } else {
                  localStorage.setItem('user', JSON.stringify({ id: status.result.id, email: status.result.email, first_name: status.result.first_name, last_name: status.result.last_name, location: status.result.location, rooms: status.result.rooms, friends: status.result.friends, token: status.token, photos: status.result.photos.split(",") }));
                  this.router.navigate(['/']);
                }
              },
              error => this.errorMessage = <any>error
            );
        });
    } else {
      alert("We need your location to login");
    }

  }
  fbLogin() {
    let _self = this;

    FB.login((response: any) => {
      _self.statusChangeCallback(response);
    }, {scope: 'email,user_likes,user_photos'});
  }
}