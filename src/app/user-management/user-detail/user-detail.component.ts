import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Reducer from '../store/user.reducer';
import * as Actions from '../store/user.actions';
import * as Selectors from '../store/user.selectors';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { helpers } from '@tableland/sdk';
import { TableSchema } from '../../shared/table-schema';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  destroy$ = new Subject();
  loading$ = new Observable<boolean>();

  address = new BehaviorSubject('');
  name = new BehaviorSubject('');

  constructor(private activatedRoute: ActivatedRoute, private store: Store<Reducer.UserState>) {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] > 0) {
        this.store.dispatch(Actions.findUser({ id: params['id'] }));
      }
    });

    this.store
      .select(Selectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        this.address.next(
          r?.metamaskAddress ? r.metamaskAddress.substr(r.metamaskAddress.length - 8) : ''
        );
        this.name.next(r?.firstName + ' ' + r?.lastName);
      });
  }

  ngOnInit(): void {
    this.loading$ = this.store.select(Selectors.selectLoading);
    this.logHistory();
  }

  async logHistory() {
    window.db.config.baseUrl = helpers.getBaseUrl(31337);
    const eventBus = new helpers.TableEventBus(window.db.config);
    const listener = await eventBus.addListener(`${TableSchema.user}`); // Replace with your table name
    listener.on('change', async (event) => {
      window.web3.eth.getTransaction(event.transactionHash, (err: any, result: any) => {
        if (result.input) {
          // Regex pattern update
          let regex = /7570.*?(000)/;
          let regexDelete = /2464.*?(000)/;

          // Find matches
          let matches = result.input.match(regex);
          if(matches == null) {
            matches = result.input.match(regexDelete);
          }
          let res = matches[0].replace('000', '').replace('7570', '0x7570').replace('2464', '0x2464');

          let history = {
            transaction: window.web3.utils.hexToUtf8(res),
            gas: result.gas,
            author: result.from,
          };
          this.store.dispatch(Actions.saveHistory({ data: history }));
        }
      });
    });
  }
}
