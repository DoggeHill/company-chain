import { Web3Service } from './../../../services/web3.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatDialog, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { DeleteDialog } from '../../../shared/delete-dialog/delete-dialog';
import { IpfsService } from '../../../services/ipfs.service';
import * as Reducer from '../../store/user.reducer';
import * as Actions from '../../store/user.ipfs.actions';
import * as Selectors from '../../store/user.selectors';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IpfsFile } from '../../model/ipfs-file';

@Component({
  selector: 'app-user-document',
  templateUrl: './user-document.component.html',
  styleUrl: './user-document.component.scss',
})
export class UserDocumentComponent {
  @ViewChild('documentGrid') grid!: AgGridAngular;
  formGroup: FormGroup | undefined;
  address: string = '';
  editMode: boolean = false;
  fileName = '';
  http: any;
  destroy$ = new Subject();
  public rowData: IpfsFile[] = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog, private ipfsService: IpfsService, private store: Store<Reducer.UserState>, private web3Service: Web3Service) {
    this.createFormGroup();
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
    let dialogRef = this.dialog.open(DeleteDialog, {
      data: { filename: selectedRow.name },
    });
  }

  cancel() {
    this.editMode = false;
    this.formGroup?.disable();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({});
    this.formGroup.disable();
  }

  ngOnInit(): void {
    this.store
      .select(Selectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        console.log(r);
        this.address = r!.metamaskAddress;
        // this.ipfsService.listAllFiles().then((res) => console.log(res));
        // this.ipfsService.listUsersDocuments(r!.metamaskAddress).then((res) => console.log(res));
        this.store.dispatch(Actions.listDocuments({ address: r!.metamaskAddress }));
      });

    this.store
      .select(Selectors.selectDocuments)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        this.rowData = r.flatMap((e) => {return {cid: e.cid, userAddress: e.userAddress}})
      });
  }

  rowDoubleClicked(row: any) {
    this.ipfsService.downloadJSONfile(row.cid).pipe(takeUntil(this.destroy$)).subscribe(r => {
      console.log(r);
    });
  }

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [{ field: 'cid' }, { field: 'userAddress', width: 700 }];

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.store.dispatch(Actions.uploadDocument({ file: file, address: this.address }));
    }
  }

  onDestroy() {}
}
