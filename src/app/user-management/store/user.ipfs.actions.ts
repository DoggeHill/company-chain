import { createAction, props } from "@ngrx/store";
import { IpfsFile } from "../../shared/ipfs-file";

export const listDocuments = createAction(
    '[IPFS] List IPFS documents',
    props<{ address: string }>()
);

export const listDocumentSuccess = createAction(
    '[IPFS] List IPFS documents success',
    props<{ data: IpfsFile[] }>()
);
  
export const listDocumentFailure = createAction(
    '[IPFS] List IPFS documents failure',
    props<{ error: any }>()
);

export const uploadDocument = createAction(
    '[IPFS] Upload IPFS documents',
    props<{ file: File, address: string }>()
);

export const uploadDocumentSuccess = createAction(
    '[IPFS] Upload IPFS documents success',
    props<{ data: IpfsFile }>()
);
  
export const uploadDocumentFailure = createAction(
    '[IPFS] Upload IPFS documents failure',
    props<{ error: any }>()
);