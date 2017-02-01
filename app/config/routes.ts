import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent }         from '../components/app.component';
import { JetChatComponent }     from '../components/jetchat.component';
import { LoginComponent }       from '../components/login.component';
import { SignUpComponent }      from '../components/signup.component';

import { AuthGuard }            from '../guards/index';

const routes: Routes = [
  {
    path: '',
    component: JetChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [AppComponent, JetChatComponent, LoginComponent, SignUpComponent];