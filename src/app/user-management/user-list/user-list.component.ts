import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent, GridApi, SelectionChangedEvent } from 'ag-grid-community';

import { Store } from '@ngrx/store';
import * as Reducer from '../store/user.reducer';
import * as Action from '../store/user.actions';
import * as Selector from '../store/user.selectors';
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs';
import { User, mapIntToSex } from '../model/user';
import { TableLandService } from '../../services/table-land.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog } from '../../shared/delete-dialog/delete-dialog';
import { AuthGuard } from '../../services/can-activate.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private _destroy$ = new Subject();
  private _gridReady: boolean = false;
  public gridApi: GridApi | any = undefined;
  public canEdit = new BehaviorSubject(false);
  public rowData: User[] = [];
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass: string = 'ag-theme-quartz';

  constructor(private router: Router, private store: Store<Reducer.UserState>, private tableLandService: TableLandService, public dialog: MatDialog, private authGuard: AuthGuard) {
    this.loadData();
  }

  ngOnInit(): void {
    this.store
      .select(Selector.selectUserList)
      .pipe(
        takeUntil(this._destroy$),
        filter((res) => !!res)
      )
      .subscribe((res) => {
        this.rowData = res;
      });
    this.loadData();

    this.authGuard
      .getPermission()
      .pipe(
        takeUntil(this._destroy$),
        filter((res) => res)
      )
      .subscribe(() => {
        this.canEdit.next(true);
      });
  }

  rowDoubleClicked() {
    this.router.navigate(['user-detail', this.gridApi.getSelectedRows()[0].id]);
  }

  loadData() {
    if (!this._gridReady) return;
    this.store.dispatch(Action.listUsers());
  }

  // Load data into grid when ready
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this._gridReady = true;
    this.loadData();
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.gridApi.getSelectedRows();
  }

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'birthDay', type: 'date' },
    { field: 'address' },
    {
      field: 'sex',
      valueGetter: (p) => mapIntToSex(p.data.sex),
      filter: 'none',
    },
    { field: 'field' },
    { field: 'name' },
  ];

  addUser() {
    this.router.navigate(['user-detail/', 0]);
  }

  deleteUser() {
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { fileName: 'nieco' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.store.dispatch(Action.deleteUser({ user: this.gridApi.getSelectedRows()[0] as User }));
    });
  }

  onDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
