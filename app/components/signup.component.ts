import { Component, Inject, OnInit} from '@angular/core';
import { Router } 					        from '@angular/router';
import { UserService } 			        from '../services/user.service';
import * as io 						          from 'socket.io-client';

declare const FB:any;

@Component({
  selector: 'signup',
  template: `
    <h2>Sign up</h2>

    <form #myDetailsForm="ngForm" (ngSubmit)="create(newUser)" class="form--my-details grid--md2">
      <div class="grid__item">
        <div *ngFor="let detail of newUser | keys">
          <input type="text" name="{{detail.key}}" value="{{detail.value}}" disabled/>
        </div>
      </div>
      <div class="grid__item">
        <ul class="facebook-images">
          <li *ngFor="let photo of foundUserPhotos; let i = index;" [hidden]="i>3">
            <a href="#">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
              <img src="{{photo}}"/>
            </a>
          </li>
        </ul>
      </div>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class SignUpComponent implements OnInit {
  _socket = io.connect("http://jet.chat:1337"); 
  newUser: any = {};
  examples: Array <Object> = [];
  errorMessage: string;
  socket: any;
  marker: Object = {
    data: {
      hello: "there"
    }
  };
  userFbDetails: any = {};
  clickedUser: Object;
  messageState: Boolean = false;
  foundUserPhotos: Array<String> = [];

  constructor(
  	@Inject(UserService) private _userService: UserService,
  	@Inject(Router) 		private router: Router
  ) { }

  getUserPhotos() {
    var _self = this;

    FB.api("/me/photos?type=uploaded", (response: any) => {
      for (var i = response.data.length - 1; i >= 0; i--) {
        FB.api("/" + response.data[i].id + "?fields=images", (responseNext: any) => {
            _self.foundUserPhotos.push(responseNext.images[0].source);
        });
      }
    });
  }

  create(example: any) {
    let _self = this;

    this._socket.emit('example.create', "done");

    this._userService.create(_self.newUser)
      .subscribe(
        (item: any) => {
          localStorage.setItem('user', JSON.stringify({ id: item.id, email: item.email, photos: item.photos, first_name: item.first_name, last_name: item.last_name, token: item.token }));
          this.router.navigate(['/']);
        },
        error =>  this.errorMessage = <any>error);
  }
}