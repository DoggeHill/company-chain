import { createAction, props } from "@ngrx/store";
import { IpfsFile } from "../model/ipfs-file";

export const listDocuments = createAction(
    '[IPFS] List IPFS documents',
    props<{ address?: string }>()

);

export const listDocumentSuccess = createAction(
    '[IPFS] List IPFS documents success',
    props<{ data: IpfsFile[] }>()
);
  
export const listDocumentFailure = createAction(
    '[IPFS] List IPFS documents failure',
    props<{ error: any }>()
);

export const uploadDocuments = createAction(
    '[IPFS] Upload IPFS documents',
    props<{ data: IpfsFile[] }>()
);

export const uploadDocumentSuccess = createAction(
    '[IPFS] Upload IPFS documents success',
    props<{ data: IpfsFile[] }>()
);
  
export const uploadDocumentFailure = createAction(
    '[IPFS] Upload IPFS documents failure',
    props<{ error: any }>()
);

export const deleteDocuments = createAction(
    '[IPFS] Delete IPFS documents',
    props<{ cid: string }>()
);

export const deleteDocumentSuccess = createAction(
    '[IPFS] Delete IPFS documents success',
    props<{ cid: string }>()
);
  
export const deleteDocumentFailure = createAction(
    '[IPFS] Delete IPFS documents failure',
    props<{ error: any }>()
);