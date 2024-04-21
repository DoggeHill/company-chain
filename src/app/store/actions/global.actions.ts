import { createAction } from "@ngrx/store";

export const startEdit = createAction(
    '[Global] Start Edit',
);

export const cancelEdit = createAction(
    '[Global] Cancel Edit',
);