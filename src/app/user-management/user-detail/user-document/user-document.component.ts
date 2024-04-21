import { Web3Service } from './../../../services/web3.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DeleteDialog } from '../../../shared/delete-dialog/delete-dialog';
import { IpfsService } from '../../../services/ipfs.service';
import * as Reducer from '../../store/user.reducer';
import * as Actions from '../../store/user.ipfs.actions';
import * as Selectors from '../../store/user.selectors';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-document',
  templateUrl: './user-document.component.html',
  styleUrl: './user-document.component.scss',
})
export class UserDocumentComponent {
  @ViewChild('documentGrid') grid!: AgGridAngular;
  formGroup: FormGroup | undefined;
  editMode: boolean = false;
  fileName = '';
  http: any;
  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private ipfsService: IpfsService,
    private store: Store<Reducer.UserState>,
    private web3Service: Web3Service
  ) {
    this.createFormGroup();

    this.store
      .select(Selectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        console.log(r);
        this.store.dispatch(Actions.listDocuments({ address: r?.metamaskAddress }));
      });
  }

  edit() {
    this.editMode = true;
    this.formGroup?.enable();
  }

  save() {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DeleteDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  delete() {
    let selectedRow: any = this.grid.api.getSelectedRows()[0];
    this.rowData = this.rowData.filter((e) => e.name !== selectedRow.name);
    let dialogRef = this.dialog.open(DeleteDialog, {
      data: { filename: selectedRow.name },
    });
    this.grid.api.setGridOption('rowData', this.rowData);
  }

  cancel() {
    this.editMode = false;
    this.formGroup?.disable();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({});
    this.formGroup.disable();
  }

  ngOnInit(): void {}

  rowData = [
    { type: 'pdf', name: 'Certificate', validFrom: new Date(), valid: true },
    { type: 'docx', name: 'Agreement', validFrom: new Date(), valid: false },
    { type: 'png', name: 'Invoice', validFrom: new Date(), valid: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [{ field: 'type' }, { field: 'name' }, { field: 'validFrom' }, { field: 'valid' }];

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.rowData.push({ type: file.type, name: file.name, validFrom: new Date(), valid: true });
      this.grid.api.setGridOption('rowData', this.rowData);
    }
  }

  onDestroy() {}
}
