import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as Reducer from '../../store/user.reducer';
import * as Actions from '../../store/user.actions';
import * as Selectors from '../../store/user.selectors';
import { Subject, combineLatest, filter, takeUntil, switchMap, from, BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';
import { Department } from '../../../shared/department';
import { Office } from '../../../shared/office';
import { Employee } from '../../model/employee';
import UserAccessControl from '../../../../assets/contracts/UserAccessControl.json';
import { Web3Service } from '../../../services/web3.service';
import { AbiItem } from 'web3-utils';
import { ContractAddresses } from '../../../shared/contract-addresses';

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

  constructor(private store: Store<Reducer.UserState>, private fb: FormBuilder, private registers: RegisterService, private metamaskService: Web3Service) {
    this.contract = new window.web3.eth.Contract(UserAccessControl.abi as AbiItem[], ContractAddresses.USER_ACCESS_CONTRACT);

    combineLatest([registers.listDepartments(), registers.listOffices()]).subscribe(([deps, offs]) => {
      this.departments = deps.results;
      this.offices = offs.results;
      this.createFormGroup();
    });
  }

  ngOnInit(): void {
    this.store
      .select(Selectors.selectUser)
      .pipe(
        takeUntil(this._destroy$),
        filter((e) => !!e),
        switchMap((user) => {
          this.store.dispatch(Actions.findEmployee({ id: user?.employeeId! }));
          return from(this.contract.methods.isMinter().send({from: user?.metamaskAddress}));
        })
      )
      .subscribe((minter) => {
        if(minter) this.minter.next(true);
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
    this.store.dispatch(Actions.editEmployee({ data: this.formGroup.get('department').getRawValue() }));
    this.editMode = false;
    this.formGroup.disable();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      token: this.fb.group({
        id: this.fb.control(null),
        access: this.fb.control(this.minter),
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
