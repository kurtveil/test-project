import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { AdminGuard } from '../guards/admin.guard';
import { UsersComponent } from './users/users.component';


const childRoutes: Routes  = [
  { path: 'users', component: UsersComponent, data: {title: 'Usuarios'},  canActivate: [ AdminGuard ], },
 
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
