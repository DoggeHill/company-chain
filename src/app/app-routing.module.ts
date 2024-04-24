import { EmployeeDetailComponent } from './user-management/user-detail/employee-detail/employee-detail.component';
import { UserBasicInformationComponent } from './user-management/user-detail/user-basic-information/user-basic-information.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { UserListComponent } from './user-management/user-detail/user-list/user-list.component';
import { UserDetailComponent } from './user-management/user-detail/user-detail.component';
import { UserDocumentComponent } from './user-management/user-detail/user-document/user-document.component';
import { AuthGuard } from './services/can-activate.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-information',
        pathMatch: 'full',
      },
      {
        path: 'basic-information',
        component: UserBasicInformationComponent,
      },
      {
        path: 'employee-detail',
        component: EmployeeDetailComponent,
      },
      {
        path: 'document',
        component: UserDocumentComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
