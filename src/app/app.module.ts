import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { UserModule } from './user-management/user.module';
import { metaReducers, reducers } from './store/reducer/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import {
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import moment from 'moment';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateFormats,
} from '@angular-material-components/datetime-picker';
import { StartupComponent } from './startup/startup.component';
import { CredentialsDialogComponent } from './startup/credentials-dialog/credentials-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


registerLocaleData(localeSk, 'sk');

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'l, LTS',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [AppComponent, DashboardComponent, StartupComponent, CredentialsDialogComponent],
  imports: [
    UserModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'sk-SK' },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'sk' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    this.overrideDate();
  }

  overrideDate() {
    Date.prototype.toJSON = function (key) {
      return moment(this).format('DD/MM/YYYY');
    };
    // @ts-ignore
    moment.fn.toJSON = function (key: string) {
      return moment(this).format('DD/MM/YYYY');
    };
  }
}
