import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { IonicModule } from '@ionic/angular';
import { SocialLoginModule } from 'angularx-social-login';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SocialLoginModule
  ],
  exports: [
    LoginComponent
  ],
  entryComponents: [
    LoginComponent
  ],
})
export class SharedModule { }
