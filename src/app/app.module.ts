import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/authenricate/login/login.component';
import { UsersModule } from './features/user/users.module';
import { SystemErrorComponent } from './shared/component/error/system-error.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from './shared/auth/token.interceptor';
import { FormsModule } from '@angular/forms';
import { MessageAddComponent } from './features/message/message-add/message-add.component';
import { MessageComponent } from './features/valid/message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SystemErrorComponent,
    MessageAddComponent,
    MessageComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsersModule,
    SharedModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    TokenInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
