import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Reducer from '../store/user.reducer';
import * as Actions from '../store/user.actions';
import * as Selectors from '../store/user.selectors';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  destroy$ = new Subject();
  loading$ = new Observable<boolean>();

  address = new BehaviorSubject("");
  name = new BehaviorSubject("");

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<Reducer.UserState>,
  ) {
   
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] > 0) {
        this.store.dispatch(Actions.findUser({ id: params['id'] }));
      }
    });
    
    this.store.select(Selectors.selectUser)
    .pipe(takeUntil(this.destroy$))
    .subscribe((r) => {
      this.address.next(r?.metamaskAddress ? r.metamaskAddress.substr(r.metamaskAddress.length - 8) : "");
      this.name.next(r?.firstName + " " + r?.lastName);
    });
  }

  ngOnInit(): void {
    this.loading$ = this.store.select(Selectors.selectLoading);
  }
}

