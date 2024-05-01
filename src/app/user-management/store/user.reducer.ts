import { listDocumentSuccess } from './user.ipfs.actions';
import { createReducer, on } from '@ngrx/store';
import * as Action from '../store/user.actions';
import * as IpfsAction from '../store/user.ipfs.actions';
import { Address, User } from '../model/user';
import { Employee } from '../model/employee';
import { IpfsFile } from '../model/ipfs-file';

export interface UserState {
  userList: User[];
  user: User | null;
  employee: Employee | null;
  address: Address | null;
  loading: boolean;
  editMode: boolean;
  history: any[];
  documents: IpfsFile[];
}

export const initialState: UserState = { user: null, userList: [], address: null, employee: null, loading: false, editMode: false, history: [], documents: [] };

export const UserReducer = createReducer(
  initialState,
  on(Action.findUserSuccess, (state: UserState, { data }) => ({ ...state, user: data })),
  on(Action.findEmployeeSuccess, (state: UserState, { data }) => ({ ...state, employee: data })),
  on(Action.findUserAddressSuccess, (state: UserState, { data }) => ({ ...state, address: data })),

  on(Action.editUser, (state: UserState) => ({ ...state, loading: true })),
  on(Action.editUserSuccess, (state: UserState, {data}) => ({ ...state, editMode: false, loading: false, user: data })),
  on(Action.editUserFailure, (state: UserState) => ({ ...state, loading: false })),

  on(Action.editEmployee, (state: UserState) => ({ ...state, loading: true })),
  on(Action.editEmployeeSuccess, (state: UserState, {data}) => ({ ...state, editMode: false, loading: false, employee: data })),
  on(Action.editEmployeeFailure, (state: UserState) => ({ ...state, loading: false })),

  on(Action.listUserSuccess, (state: UserState, { data }) => ({ ...state, userList: data })),
  on(Action.deleteUserSuccess, (state: UserState, { id }) => {
    const gridData = state.userList.filter((f) => f.id != id);
    return { ...state, userList: gridData };
  }),

  on(Action.saveHistory, (state: UserState, { data }) => ({ ...state, history: state.history.concat(data) })),

  on(IpfsAction.listDocumentSuccess, (state: UserState, { data }) => ({ ...state, documents: data })),
  on(IpfsAction.uploadDocumentSuccess, (state: UserState, { data }) => ({ ...state, documents: state.documents.concat(data) })),
);

