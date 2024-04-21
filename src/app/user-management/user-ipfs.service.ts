import { Injectable } from '@angular/core';
import { IpfsService } from '../services/ipfs.service';
import { Web3Service } from '../services/web3.service';
import { Observable } from 'rxjs';
import { IpfsFile } from './model/ipfs-file';
import { ResponseObject } from '../shared/response-object';

@Injectable({
  providedIn: 'root',
})
export class UserIpfsService {
  constructor(
    private ipfsService: IpfsService,
    private web3Service: Web3Service,
  ) {}

  // listDocuments(): Observable<ResponseObject<IpfsFile[]>> {
  //   return new Observable;
  // }


  uploadDocument(file: File, address: string) {
    const fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const blob = new Blob([reader.result as any], { type: file.type });
      this.ipfsService.pinFileToIPFS(blob, file.name, this.web3Service.getConnectedAccount(), address);
    };
  }



}
