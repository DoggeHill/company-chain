import { Injectable } from '@angular/core';
import * as Action from './user.ipfs.actions';
import { UserIpfsService } from '../user-ipfs.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, take, takeUntil, takeWhile } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserIpfsEffects {
  constructor(
    private snackBar: MatSnackBar,
    private actions$: Actions,
    private service: UserIpfsService
  ) {}

  listDocuments = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.listDocuments),
      mergeMap((action) =>
        this.service.listDocuments(action.address).pipe(
          map((res) => {
            if (res) {
              console.log(res);
              return Action.listDocumentSuccess({ data: res });
            } else {
              this.snackBar.open('Error' + res, 'Close', {
                duration: 2000,
              });
              return Action.listDocumentFailure({ error: res });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.listDocumentFailure({ error: err }));
          })
        )
      )
    )
  );

  uploadDocument = createEffect(() =>
    this.actions$.pipe(
      ofType(Action.uploadDocument),
      mergeMap((action) =>
        from(this.service.uploadDocument(action.file, action.address)).pipe(
          map((res: any) => {
            if (res) {
              return Action.uploadDocumentSuccess({ data: res });
            } else {
              this.snackBar.open('Error' + res, 'Close', {
                duration: 2000,
              });
              return Action.uploadDocumentFailure({ error: res });
            }
          }),
          catchError((err) => {
            this.snackBar.open('Error' + err, 'Close', {
              duration: 2000,
            });
            return of(Action.uploadDocumentFailure({ error: err }));
          })
        )
      )
    )
  );
}
