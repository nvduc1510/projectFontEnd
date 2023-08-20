import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemErrorComponent } from 'src/app/shared/component/error/system-error.component';
import { UserListComponent } from './list/user-list.component';
import { AuthorizeGuard } from '../../shared/auth/authorize.guard';
import { AddComponent } from './add/add.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { DetailComponent } from './detail/detail.component';
import { CompleteComponent } from './complete/complete.component';

const routes: Routes = [
  { path: 'user', redirectTo: 'user/list', pathMatch: 'full'},
  { path: 'user/list', component: UserListComponent, canActivate: [AuthorizeGuard] },
  { path: 'user/add', component: AddComponent, canActivate: [AuthorizeGuard] },
  { path: 'user/confirm', component: ConfirmComponent, canActivate: [AuthorizeGuard] },
  { path: 'user/complete', component: CompleteComponent, canActivate: [AuthorizeGuard] },
  { path: 'detail', component: DetailComponent, canActivate: [AuthorizeGuard] },
  { path: '**', component: SystemErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
