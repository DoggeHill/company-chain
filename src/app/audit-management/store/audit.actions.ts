import { createAction, props } from "@ngrx/store";
import { Audit } from "../model/audit";

export const findUser = createAction(
    '[User] Find User'
  );
  export const findUserSuccess = createAction(
    '[User] Find User success',
    props<{ data: Audit }>()
  );
  
  export const findUserFailure = createAction(
    '[User] Find User failure',
    props<{ error: any }>()
  );
  