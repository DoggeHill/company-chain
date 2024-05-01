import { Injectable } from '@angular/core';
import { ContractAddresses } from '../shared/contract-addresses';
import { PinataCredentials } from '../shared/pinata-credentials';
import { AbiItem } from 'web3-utils';
import IpfsContract from '../../assets/contracts/FileStorage.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { IpfsFile } from '../shared/ipfs-file';

@Injectable({
  providedIn: 'root',
})
export class IpfsService {

  constructor(private http: HttpClient) {
  }

  testConnection() : Observable<{message: string}>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PinataCredentials.PINATA_JWT}`
    })
    return this.http.get<{message: string}>('https://api.pinata.cloud/data/testAuthentication', {headers : headers});
  }

  downloadPinataFile(cid: string, fileName: string) {
    const link = document.createElement('a');
    link.href = 'https://gateway.pinata.cloud/ipfs/' + cid;
    link.target = "_blank";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
  }
  
  downloadFile(cid: string): Observable<Object> {
    return this.http.get('https://gateway.pinata.cloud/ipfs/' + cid);
  }

  pinFileToIPFS(file: Blob, fileName: string, author: string, address: string) {
    const formData = new FormData();
    const now = new Date().toISOString();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: fileName,
      author: author,
      user: address,
      date: now,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${PinataCredentials.PINATA_JWT}`
    });
    
    return this.http.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {headers : headers}).pipe(
      switchMap((res: any) => {
        // Save hash to ETH
        return this.pinFileToEth(res.IpfsHash, author, address, fileName, now);
      })
    )
  }

  pinFileToEth(cid: string, authorAddress: string, address: string, fileName: string, uploadDate: string) {
    const contract = new window.web3.eth.Contract(IpfsContract.abi as AbiItem[], ContractAddresses.IPFS_CONTRACT);
    return contract.methods.storeCIDAndUserAddress(cid, address, authorAddress, fileName, uploadDate).send({ from: authorAddress });
  }

  listUsersDocuments(address: string): Promise<IpfsFile[]> {
    const contract = new window.web3.eth.Contract(IpfsContract.abi as AbiItem[], ContractAddresses.IPFS_CONTRACT);
    return contract.methods.getUserFiles(address).call();
  }

  listAllFiles() {
    const contract = new window.web3.eth.Contract(IpfsContract.abi as AbiItem[], ContractAddresses.IPFS_CONTRACT);
    return contract.methods.getAllFiles().call();
  }
}
