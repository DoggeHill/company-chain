import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import * as UserReducer from "../../user-management/store/user.reducer";

export const appModuleFeatureKey = 'app-module';


export interface AppState {
  userState: UserReducer.UserState;
}

export const initialAppState: AppState = {
  userState: UserReducer.initialState,
}

export const reducers: ActionReducerMap<AppState> = {
  userState: UserReducer.UserReducer,
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [debug];