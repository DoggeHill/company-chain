import { createAction, props } from "@ngrx/store";
import { Address, User } from "../model/user";
import { Employee } from "../model/employee";

export const listUsers = createAction(
  '[User] List User',

);
export const listUserSuccess = createAction(
  '[User] List User success',
  props<{ data: User[] }>()
);

export const listUserFailure = createAction(
  '[User] List User failure',
  props<{ error: any }>()
);

export const findUser = createAction(
  '[User] Find User',
  props<{ id: number }>()

);
export const findUserSuccess = createAction(
  '[User] Find User success',
  props<{ data: User }>()
);

export const findUserFailure = createAction(
  '[User] Find User failure',
  props<{ error: any }>()
);

export const findEmployee = createAction(
  '[User] Find Employee',
  props<{ id: number }>()

);
export const findEmployeeSuccess = createAction(
  '[User] Find Employee success',
  props<{ data: Employee }>()
);

export const findEmployeeFailure = createAction(
  '[User] Find Employee failure',
  props<{ error: any }>()
);

export const findUserAddress = createAction(
  '[User] Find User Address',
  props<{ id: number }>()

);
export const findUserAddressSuccess = createAction(
  '[User] Find User Address success',
  props<{ data: Address }>()
);

export const findUserAddressFailure = createAction(
  '[User] Find User Address failure',
  props<{ error: any }>()
);

export const editUser = createAction(
  '[User] Edit User',
  props<{ data: User }>()
);
export const editUserSuccess = createAction(
  '[User] Edit User success',
  props<{ data: User }>()
);

export const editUserFailure = createAction(
  '[User] Edit User failure',
  props<{ error: any }>()
);

export const deleteUser = createAction(
  '[User] Delete User',
  props<{ user: User }>()
);
export const deleteUserSuccess = createAction(
  '[User] Delete User success',
  props<{ id: number }>()
);

export const deleteUserFailure = createAction(
  '[User] Delete User failure',
  props<{ error: any }>()
);

export const editEmployee = createAction(
  '[User] Edit Employee',
  props<{ data: Employee }>()
);
export const editEmployeeSuccess = createAction(
  '[User] Edit Employee success',
  props<{ data: Employee }>()
);

export const editEmployeeFailure = createAction(
  '[User] Edit Employee failure',
  props<{ error: any }>()
);