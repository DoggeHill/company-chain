import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as Reducer from '../../store/user.reducer';
import * as Actions from '../../store/user.actions';
import * as Selectors from '../../store/user.selectors';
import {
  Subject,
  combineLatest,
  filter,
  takeUntil,
  switchMap,
  from,
  BehaviorSubject,
  catchError,
  of,
} from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';
import { Department } from '../../../shared/department';
import { Office } from '../../../shared/office';
import { Employee } from '../../model/employee';
import UserAccessControl from '../../../../assets/contracts/UserAccessControl.json';
import { Web3Service } from '../../../services/web3.service';
import { AbiItem } from 'web3-utils';
import { ContractAddresses } from '../../../shared/contract-addresses';
import { User } from '../../model/user';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss',
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  formGroup: any = undefined;
  private _destroy$ = new Subject();

  employee: Employee | null = null;
  departments: Department[] = [];
  offices: Office[] = [];
  contract: any = null;
  minter = new BehaviorSubject(false);
  user: User | null = null;

  constructor(
    private store: Store<Reducer.UserState>,
    private fb: FormBuilder,
    private registers: RegisterService,
    private userService: UserService,
    private metamaskService: Web3Service,
    private snackBar: MatSnackBar
  ) {
    this.contract = new window.web3.eth.Contract(
      UserAccessControl.abi as AbiItem[],
      ContractAddresses.USER_ACCESS_CONTRACT
    );
    this.createFormGroup();

    combineLatest([registers.listDepartments(), registers.listOffices()]).subscribe(
      ([deps, offs]) => {
        this.departments = deps.results;
        this.offices = offs.results;
      }
    );
  }

  ngOnInit(): void {
    this.store
      .select(Selectors.selectUser)
      .pipe(
        takeUntil(this._destroy$),
        filter((e) => !!e),
        switchMap((user) => {
          this.user = user;
          this.store.dispatch(Actions.findEmployee({ id: user?.employeeId! }));
          const roleHash = window.web3.utils.keccak256('MINTER_ROLE');
          return from(this.contract.methods.hasRole(roleHash, user?.metamaskAddress).call());
        })
      )
      .subscribe((minter) => {
        if (minter) {
          this.formGroup.get('token.access').setValue(true);
          this.minter.next(true);
        } else {
          this.minter.next(false);
          this.formGroup.get('token.access').setValue(false);
        }
      });

    this.store
      .select(Selectors.selectEmployee)
      .pipe(takeUntil(this._destroy$))
      .subscribe((r) => {
        this.employee = r;
        this.formGroup.get('department').patchValue(r);
      });
  }

  edit() {
    this.editMode = true;
    this.formGroup?.enable();
  }

  save() {
    const value = this.formGroup.get('token.access').value;

    // Under normal circumstances this authentication should be done through redux store on service layer
    // However for simple example purposes and simpler debugging it is places here
    if (value != this.minter.value) {
      if (value) {
        this.contract.methods
          .grantMinterRole(this.user!.metamaskAddress)
          .send({ from: this.metamaskService.getConnectedAccount() });
        this.userService
          .grantAccessToAllTables(this.user!.metamaskAddress)
          .pipe(takeUntil(this._destroy$))
          .subscribe((res) => {
            if (res.success) {
              this.snackBar.open('Access granted', 'Close', {
                duration: 2000,
              });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(false);
          });
      } else {
        this.contract.methods
          .revokeMinterRole(this.user!.metamaskAddress)
          .send({ from: this.metamaskService.getConnectedAccount() });

        this.userService
          .revokeAccessFromAllTables(this.user!.metamaskAddress)
          .pipe(takeUntil(this._destroy$))
          .subscribe((res) => {
            if (res.success) {
              this.snackBar.open('Access revoked', 'Close', {
                duration: 2000,
              });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(false);
          });
      }
    }
    this.store.dispatch(
      Actions.editEmployee({ data: this.formGroup.get('department').getRawValue() })
    );
    this.editMode = false;
    this.formGroup.disable();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      token: this.fb.group({
        id: this.fb.control(null),
        access: this.fb.control(null),
      }),
      department: this.fb.group({
        id: this.fb.control(null),
        officeId: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        departmentId: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
      }),
    });
    this.formGroup.disable();
  }

  cancel() {
    this.editMode = false;
    this.formGroup?.disable();
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
