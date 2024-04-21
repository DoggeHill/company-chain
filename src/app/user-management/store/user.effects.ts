import { Injectable } from "@angular/core";
import * as Action from "./user.actions";
import { UserService } from "../user.service";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class UserEffect {
  constructor(
    private actions$: Actions,
    private service: UserService,) {
  }

  listUsers = createEffect(() => this.actions$.pipe(
    ofType(Action.listUsers),
    mergeMap((action) => this.service.listUsers().pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
          return Action.listUserSuccess({data: res.responseData});
        } else {
          return Action.listUserFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.listUserFailure({error: err}));
      })
    ))
  ));


  findUser = createEffect(() => this.actions$.pipe(
    ofType(Action.findUser),
    mergeMap((action) => this.service.findUser(action.id).pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
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

  editUser = createEffect(() => this.actions$.pipe(
    ofType(Action.editUser),
    mergeMap((action) => this.service.editUser(action.data).pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
          return Action.editUserSuccess({data: res.responseData});
        } else {
          return Action.editUserFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.editUserFailure({error: err}));
      })
    ))
  ));


  findUserAddress = createEffect(() => this.actions$.pipe(
    ofType(Action.findUserAddress),
    mergeMap((action) => this.service.findUserAddress(action.id).pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
          return Action.findUserAddressSuccess({data: res.responseData});
        } else {
          return Action.findUserAddressFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.findUserAddressFailure({error: err}));
      })
    ))
  ));

  findEmployee = createEffect(() => this.actions$.pipe(
    ofType(Action.findEmployee),
    mergeMap((action) => this.service.findEmployee(action.id).pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
          return Action.findEmployeeSuccess({data: res.responseData});
        } else {
          return Action.findEmployeeFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.findEmployeeFailure({error: err}));
      })
    ))
  ));

  editEmployee = createEffect(() => this.actions$.pipe(
    ofType(Action.editUser),
    mergeMap((action) => this.service.editEmployee(action.data).pipe(
      map(res => {
        if (res.success) {
          console.log(res.success);
          return Action.editEmployeeSuccess({data: res.responseData});
        } else {
          return Action.editEmployeeFailure({error: res.responseMessage});
        }
      }),
      catchError(err => {
        return of(Action.editEmployeeFailure({error: err}));
      })
    ))
  ));
}