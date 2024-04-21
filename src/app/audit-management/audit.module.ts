import { SharedModule } from "../shared/shared.module";
import { EmployeeDetailComponent } from "./user-detail/employee-detail/employee-detail.component";
import { UserBasicInformationComponent } from "./user-detail/user-basic-information/user-basic-information.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserDocumentComponent } from "./user-detail/user-document/user-document.component";
import { UserListComponent } from "./user-detail/user-list/user-list.component";

import { NgModule } from '@angular/core';
import { AuditManagementComponent } from './audit-management/audit-management.component';


@NgModule({
    declarations: [
        AuditManagementComponent,
    ],
    imports: [
        SharedModule
    ],
    providers: [
      
    ],
    bootstrap: [  SharedModule]
})
export class UserModule { }
