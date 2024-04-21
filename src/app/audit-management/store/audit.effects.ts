import { Injectable } from "@angular/core";
import * as Action from "./user.actions";
import { UserService } from "../user.service";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class AppDeviceEffect {
  constructor(
    private actions$: Actions,
    private service: UserService,) {
  }

  findUser = createEffect(() => this.actions$.pipe(
    ofType(Action.findUser),
    mergeMap(() => this.service.findUser().pipe(
      map(res => {
        if (res.success) {
          return Action.findUserSuccess({data: res.responseData});
        } else {
          return Action.findUserFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.findUserFailure({error: err}));
      })
    ))
  ));
}