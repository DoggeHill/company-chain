import { Injectable } from '@angular/core';
import * as Action from './user.actions';
import { UserService } from '../user.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffect {
  constructor(
    private snackBar: MatSnackBar,
    private actions$: Actions,
    private service: UserService
  ) {}

  listUsers = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.listUsers),
      mergeMap(() =>
        this.service.listUsers().pipe(
          map((res) => {
            if (res.success) {
              return Action.listUserSuccess({ data: res.results });
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return Action.listUserFailure({ error: res.results });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.listUserFailure({ error: err }));
          })
        )
      )
    )
  );

  findUser = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.findUser),
      mergeMap((action) =>
        this.service.findUser(action.id).pipe(
          map((res) => {
            if (res.success) {
              return Action.findUserSuccess({ data: res.results });
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return Action.findUserFailure({ error: res.responseMessage });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.findUserFailure({ error: err }));
          })
        )
      )
    )
  );

  editUser = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.editUser),
      delay(1000),
      switchMap((action) => {
        if (action.data.id) {
           return this.service.editUser(action.data).pipe(
            delay(1000),
            filter((res) => !!res),
            switchMap((res) => {
              if (res.success) {
                return this.service.findUser(res.results).pipe(
                  delay(300),
                  map((res) => Action.editUserSuccess({ data: res.results })),
                  catchError((err) => of(Action.editUserFailure({ error: err })))
                );
              } else {
                this.snackBar.open('Error' + res.responseMessage, 'Close', {
                  duration: 2000,
                });
                return of(Action.editUserFailure({ error: res.responseMessage }));
              }
            }),
            catchError((err) => {
              this.snackBar.open('Error' + err, 'Close', {
                duration: 2000,
              });
              return of(Action.editUserFailure({ error: err }));
            })
          );
        } else {
          return this.service.createUser(action.data).pipe(
            delay(1000),
            filter((res) => !!res),
            switchMap((res) => {
              if (res.success) {
                return this.service.findUser(res.results.id).pipe(
                  delay(300),
                  map((res) => Action.editUserSuccess({ data: res.results })),
                  catchError((err) => of(Action.editUserFailure({ error: err })))
                );
              } else {
                this.snackBar.open('Error' + res.responseMessage, 'Close', {
                  duration: 2000,
                });
                return of(Action.editUserFailure({ error: res.responseMessage }));
              }
            }),
            catchError((err) => {
              this.snackBar.open('Error' + err, 'Close', {
                duration: 2000,
              });
              return of(Action.editUserFailure({ error: err }));
            })
          );
        }
      })
    )
  );

  deleteUser = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.deleteUser),
      mergeMap((action) =>
        this.service.deleteUser(action.user).pipe(
          map((res) => {
            if (res.success) {
              return Action.deleteUserSuccess({ id: res.results });
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return Action.deleteUserFailure({ error: res.responseMessage });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.deleteUserFailure({ error: err }));
          })
        )
      )
    )
  );

  findUserAddress = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.findUserAddress),
      mergeMap((action) =>
        this.service.findUserAddress(action.id).pipe(
          map((res) => {
            if (res.success) {
              return Action.findUserAddressSuccess({ data: res.results });
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return Action.findUserAddressFailure({ error: res.responseMessage });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.findUserAddressFailure({ error: err }));
          })
        )
      )
    )
  );

  findEmployee = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.findEmployee),
      mergeMap((action) =>
        this.service.findEmployee(action.id).pipe(
          map((res) => {
            if (res.success) {
              return Action.findEmployeeSuccess({ data: res.results });
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return Action.findEmployeeFailure({ error: res.responseMessage });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.findEmployeeFailure({ error: err }));
          })
        )
      )
    )
  );

  editEmployee = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.editEmployee),
      mergeMap((action) =>
        this.service.editEmployee(action.data).pipe(
          delay(1000),
          switchMap((res) => {
            if (res.success) {
              return this.service.findEmployee(res.results).pipe(
                map((res) => Action.editEmployeeSuccess({ data: res.results })),
                catchError((err) => of(Action.editEmployeeFailure({ error: err })))
              );
            } else {
              this.snackBar.open('Error' + res.responseMessage, 'Close', {
                duration: 2000,
              });
              return of(Action.editEmployeeFailure({ error: res.responseMessage }));
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.editEmployeeFailure({ error: err }));
          })
        )
      )
    )
  );
}
