import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Reducer from '../store/user.reducer';
import * as Actions from '../store/user.actions';
import * as Selectors from '../store/user.selectors';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Web3Service } from '../../services/web3.service';
import { Validator, helpers } from '@tableland/sdk';
import { TableSchema } from '../model/table-schema';

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
    this.logHistory();
  }

  async logHistory() {
    window.db.config.baseUrl = helpers.getBaseUrl(31337);
    const eventBus = new helpers.TableEventBus(window.db.config);
    const listener = await eventBus.addListener(`${TableSchema.user}`); // Replace with your table name
    listener.on("change", async (event) => {
        console.log(event);
        window.web3.eth.getTransaction(event.transactionHash, (err:any, result:any) => {
          if (result.input) {
          let input: any = result.input;
          // Use regex to match strings between 0s
          let matches = input.match(/(?:^|0{2})([a-f\d]+)(?=0{2}|$)/gi);

          // Filter out null and empty strings
          let result2 = matches.filter((str: any) => str);

          // Join the selected strings into one string
          let selectedString = result2.join('');


            let history = {
             transaction :result.input.replace('(?<=[1-9a-f])0+(?=[1-9a-f])', result.input),
             gas : result.gas,
             author : result.from
            }
            this.store.dispatch(Actions.saveHistory({data: history}))
            console.log(history);
          }
        });
     });
  }
}

