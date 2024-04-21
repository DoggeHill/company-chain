import { createReducer } from "@ngrx/store";

export interface UserState {
    user: any;
  }

export const initialState = {user: 0};

export const userReducer = createReducer(
  initialState,
);