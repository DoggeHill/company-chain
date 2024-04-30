import { UserState } from './../../audit-management/store/audit.reducer';
import { User } from './../model/user';
import { createSelector } from "@ngrx/store";
import * as Reducer from "../store/user.reducer";
import * as AppReducer from "../../../app/store/reducer/app.reducer";
import { selectAppState } from '../../store/selectors/global.selectos';

export const selectUserModule = createSelector(
    selectAppState,
    (state: AppReducer.AppState) => state.userState
);

export const selectUser = createSelector(
    selectUserModule,
    (state: Reducer.UserState) => state.user,
);

export const selectAddress = createSelector(
    selectUserModule,
    (state: Reducer.UserState) => state.address,
);

export const selectUserList = createSelector(
    selectUserModule,
    (state: Reducer.UserState) => state.userList,
);

export const selectEmployee = createSelector(
    selectUserModule,
    (state: Reducer.UserState) => state.employee,
);

export const selectLoading = createSelector(
    selectUserModule,
    (state: Reducer.UserState) => state.loading,
);