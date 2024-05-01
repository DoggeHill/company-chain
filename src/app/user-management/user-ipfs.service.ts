import { Injectable } from '@angular/core';
import { IpfsService } from '../services/ipfs.service';
import { Web3Service } from '../services/web3.service';
import { Observable, from } from 'rxjs';
import { IpfsFile } from '../shared/ipfs-file';

@Injectable({
  providedIn: 'root',
})
export class UserIpfsService {
  constructor(
    private ipfsService: IpfsService,
    private web3Service: Web3Service,
  ) {}

  listDocuments(address: string): Observable<IpfsFile[]> {
    return from(this.ipfsService.listUsersDocuments(address));
  }

  uploadDocument(file: File, address: string) {
    return this.ipfsService.pinFileToIPFS(file, file.name, this.web3Service.getConnectedAccount(), address);
  }
}
