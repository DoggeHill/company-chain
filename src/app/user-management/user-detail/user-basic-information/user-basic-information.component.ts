import { ActivatedRoute, Router } from '@angular/router';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Reducer from '../../store/user.reducer';
import * as Actions from '../../store/user.actions';
import * as Selectors from '../../store/user.selectors';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import moment from 'moment';
import { Address, User } from '../../model/user';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-user-basic-information',
  templateUrl: './user-basic-information.component.html',
  styleUrl: './user-basic-information.component.scss',
})
export class UserBasicInformationComponent {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  formGroup: FormGroup | undefined;
  editMode: boolean = false;
  destroy$ = new Subject();

  constructor(
    private _ngZone: NgZone,
    private fb: FormBuilder,
    private store: Store<Reducer.UserState>,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.createFormGroup();

    this.store
      .select(Selectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        let data = JSON.parse(JSON.stringify(r));
        data.birthDay = moment(r?.birthDay, 'DD/MM/YYYY').toDate();
        this.formGroup?.patchValue({ personalDetail: data });
        // @ts-ignore
        this.store.dispatch(Actions.findUserAddress({ id: r?.addressId }));
      });

    this.store
      .select(Selectors.selectAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        this.formGroup?.patchValue({ address: r });
      });
  }

 
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  edit() {
    this.editMode = true;
    this.formGroup?.enable();
    this.formGroup?.get('personalDetail.metamaskAddress')?.disable();
  }

  delete() {this.snackBar.open('Delete fro User List!', 'Close', {duration: 500})}

  save() {
    if (this.formGroup?.invalid) {
      this.snackBar.open('Form invalid', 'Close', {
        duration: 2000,
      });
      return;
    }
    let user: User = JSON.parse(JSON.stringify(this.formGroup?.getRawValue().personalDetail));
    let address: Address = JSON.parse(JSON.stringify(this.formGroup?.getRawValue().address));
    user.address = address;
    this.store.dispatch(Actions.editUser({ data: user }));
    this.editMode = false;
    this.formGroup?.disable();
  }

  cancel() {
    this.editMode = false;
    this.formGroup?.disable();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      personalDetail: this.fb.group({
        id: this.fb.control(null),
        metamaskAddress: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        firstName: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        lastName: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        birthDay: this.fb.control(null),
        sex: this.fb.control(null),
        notes: this.fb.control(null, [Validators.maxLength(5000)]),
      }),
      address: this.fb.group({
        id: this.fb.control(null),
        country: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        city: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        street: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        streetNo: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        zipCode: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
      }),
    });
    this.formGroup.disable();
  }

  dateClass: MatCalendarCellClassFunction<Date> = () => {
    return 'commonListsModule';
  };
}
