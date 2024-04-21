import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as Reducer from "../../store/user.reducer";
import * as Actions from "../../store/user.actions";
import * as Selectors from "../../store/user.selectors";
import { Subject, combineLatest, filter, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';
import { Department } from '../../model/department';
import { Office } from '../../model/office';
import { Employee } from '../../model/employee';
import UserAccessControl from '../../../../assets/contracts/UserAccessControl.json'
import { Web3Service } from '../../../services/web3.service';
import { AbiItem } from 'web3-utils'
import { ContractAddresses } from '../../../shared/contract-addresses';


@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent {
  editMode: boolean = false;
  formGroup: any = undefined;
  destroy$ = new Subject();

  employee: Employee | null = null;
  departments: Department[] = [];
  offices: Office[] = [];
  contract: any = null;

  constructor(
    private store: Store<Reducer.UserState>,
    private fb: FormBuilder,
    private registers: RegisterService,
    private metamaskService: Web3Service,
  ) {
    this.contract = new window.web3.eth.Contract(UserAccessControl.abi as AbiItem[], ContractAddresses.userAccessControlContractAddress);

    combineLatest([
      registers.listDepartments(),
      registers.listOffices(),
    ]).subscribe(([deps, offs]) => {
      this.departments = deps.responseData;
      this.offices = offs.responseData;
      this.createFormGroup();
    })

    this.store.select(Selectors.selectUser).pipe(takeUntil(this.destroy$), filter((e) => !!e)).subscribe(async r => {
      this.store.dispatch(Actions.findEmployee({id: r?.employeeId!}));

      const res = await this.contract.methods.isMinter().call();
      console.log(res);
    });

    this.store.select(Selectors.selectEmployee).pipe(takeUntil(this.destroy$)).subscribe(r => {
      this.employee = r;
      this.formGroup.get('department').patchValue(r);
    });
  }

  edit() {
    this.editMode = true;
    this.formGroup?.enable();
  }

  async save() {

    // combineLatest([
    //   this.contract.methods.isMinter().call(),
    //   this.store.dispatch(Actions.editEmployee({data: this.formGroup.get('department').getRawValue()})),
    // ]).subscribe(([deps]) => {
    //   this.createFormGroup();
    // })

    const res = await this.contract.methods.isMinter().call();

    this.store.dispatch(Actions.editEmployee({data: this.formGroup.get('department').getRawValue()}));
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      token: this.fb.group({
        id: this.fb.control(null),
        access: this.fb.control(true),
      }),
      department: this.fb.group({
        id: this.fb.control(null),
        officeId: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
        departmentId: this.fb.control(null, [Validators.required, Validators.maxLength(255)]),
      }),
    })
    this.formGroup.disable();
  }

  cancel() {
    this.editMode = false;
    this.formGroup?.disable();
  }
}
