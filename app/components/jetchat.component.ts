import { Component, Inject, OnInit} from '@angular/core';
import { Router }                   from '@angular/router';
import { UserService }              from '../services/user.service';
import { MessageService }           from '../services/message.service';
import * as io                      from 'socket.io-client';

declare const FB:any;

@Component({
  selector: 'jetchat',
  template: `
  Logged in as: {{user}}
  `,
})
export class JetChatComponent implements OnInit {
  _socket = io.connect("https://jet.chat"); 
  user: any;

  constructor(
    @Inject(UserService)    private _userService: UserService,
    @Inject(MessageService) private _messageService: MessageService,
    @Inject(Router)         private router: Router
  ) { }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  
}