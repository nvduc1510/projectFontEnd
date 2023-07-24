import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddComponent } from './add/add.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserListComponent,
    AddComponent,
    ConfirmComponent,
    EditComponent,
    
  ],
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
