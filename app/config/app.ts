import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }             from '@angular/forms';

import { AppComponent }            from '../components/app.component';
import { JetChatComponent }        from '../components/jetchat.component';
import { LoginComponent }          from '../components/login.component';
import { SignUpComponent }         from '../components/signup.component';

import { AppRoutingModule }        from './routes';

import { UserService }             from '../services/user.service';
import { MessageService }          from '../services/message.service';

import { KeysPipe }                from '../pipes/keys.pipe';
import { TimeAgoPipe }             from '../pipes/time-ago.pipe';
import { AuthGuard }               from '../guards/auth.guard';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [ 
    AppComponent,
    JetChatComponent,
    LoginComponent,
    SignUpComponent,
    KeysPipe,
    TimeAgoPipe
  ],
  providers: [ 
    AuthGuard,
    UserService,
    MessageService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }