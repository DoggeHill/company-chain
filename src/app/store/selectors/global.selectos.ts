import { createFeatureSelector } from "@ngrx/store";
import * as AppReducer from "../reducer/app.reducer";

export const selectAppState = createFeatureSelector<AppReducer.AppState>(
    AppReducer.appModuleFeatureKey,
  )
  