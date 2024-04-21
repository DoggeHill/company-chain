import { createReducer, on } from "@ngrx/store";
import * as Action from "../store/user.actions";
import { Address, User } from "../model/user";
import { Employee } from "../model/employee";

export interface UserState {
  userList: User[],
  user: User | null;
  employee: Employee | null;
  address: Address | null;
}

export const initialState: UserState = { user: null, userList: [], address: null, employee: null };

export const UserReducer = createReducer(
  initialState,
  on(Action.findUserSuccess, (state: UserState, {data}) => ({...state, user: data})),
  on(Action.findEmployeeSuccess, (state: UserState, {data}) => ({...state, employee: data})),
  on(Action.findUserAddressSuccess, (state: UserState, {data}) => ({...state, address: data})),
  on(Action.listUserSuccess, (state: UserState, {data}) => ({...state, userList: data})),
);