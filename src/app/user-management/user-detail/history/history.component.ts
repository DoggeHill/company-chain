import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import * as Reducer from '../../store/user.reducer';
import * as Selectors from '../../store/user.selectors';
import * as Actions from '../../store/user.actions';
import { User } from '../../model/user';
import { ColDef, GridReadyEvent, GridApi, SelectionChangedEvent } from 'ag-grid-community';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  destroy$ = new Subject();
  loading$ = new Observable<boolean>();

  private _destroy$ = new Subject();
  private _gridReady: boolean = false;
  public gridApi: GridApi | any = undefined;
  public canEdit = new BehaviorSubject(false);
  public rowData: User[] = [];
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  address = new BehaviorSubject("");
  name = new BehaviorSubject("");

  colDefs: ColDef[] = [
    { field: 'author' },
    { field: 'gas' },
    { field: 'transaction', width: 300 },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<Reducer.UserState>,
  ) {
  }

  ngOnInit(): void {
    this.loading$ = this.store.select(Selectors.selectLoading);

    this.store.select(Selectors.selectHistory)
    .pipe(takeUntil(this.destroy$))
    .subscribe((r) => {
      this.rowData = r;
    });
  }

  loadData() {
    if (!this._gridReady) return;
    this.store.dispatch(Actions.listUsers());
  }

  // Load data into grid when ready
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this._gridReady = true;
    this.loadData();
  }
  
}

