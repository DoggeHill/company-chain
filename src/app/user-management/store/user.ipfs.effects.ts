import { Injectable } from "@angular/core";
import * as Action from "./user.ipfs.actions";
import { UserIpfsService } from "../user-ipfs.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class UserIpfsEffects {
  constructor(
    private actions$: Actions,
    private service: UserIpfsService) {
  }

//   listDocuments = createEffect(() => this.actions$.pipe(
//     ofType(Action.listDocuments),
//     mergeMap((action) => this.service.listDocuments().pipe(
//       map(res => {
//         // if (res.success) {
//         //   console.log(res.success);
//         //   return Action.listDocumentSuccess({data: res.responseData});
//         // } else {
//         //   return Action.listDocumentFailure({error: res.responseMessage});
//         // }
//       }),
//       catchError(err => {
//         return of(Action.listDocumentFailure({error: err}));
//       })
//     ))
//   ));
}