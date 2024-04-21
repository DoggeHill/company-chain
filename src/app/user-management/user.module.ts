import { EffectsModule } from "@ngrx/effects";
import { SharedModule } from "../shared/shared.module";
import { EmployeeDetailComponent } from "./user-detail/employee-detail/employee-detail.component";
import { UserBasicInformationComponent } from "./user-detail/user-basic-information/user-basic-information.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserDocumentComponent } from "./user-detail/user-document/user-document.component";
import { UserListComponent } from "./user-detail/user-list/user-list.component";

import { NgModule } from '@angular/core';
import { UserEffect } from "./store/user.effects";
import { StoreModule } from "@ngrx/store";
import { appModuleFeatureKey, reducers } from "../store/reducer/app.reducer";
import { UserIpfsEffects } from "./store/user.ipfs.effects";

@NgModule({
    declarations: [
        UserListComponent,
        UserDetailComponent,
        UserBasicInformationComponent,
        EmployeeDetailComponent,
        UserDocumentComponent,
    ],
    imports: [
        SharedModule,
        StoreModule.forFeature(appModuleFeatureKey, reducers),
        EffectsModule.forFeature([
            UserEffect,
            UserIpfsEffects,
        ]),
    ],
})
export class UserModule {  
}
