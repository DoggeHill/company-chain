import { Injectable } from '@angular/core';
// IPFS Client
//import pinataSDK from '@pinata/sdk';
import { ContractAddresses } from '../shared/contract-addresses';
// Smart contracts
import { AbiItem } from 'web3-utils';
import IpfsContract from '../../assets/contracts/FileStorage.json';
import { PinataCredentials } from '../shared/pinata-credentials';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  
  // Download configuration file
  downloadJSONfile(cid: string): Observable<Object> {
    return this.http.get('https://gateway.pinata.cloud/ipfs/' + cid);
  }

  async fileToReadableStream(file: File): Promise<ReadableStream<Uint8Array>> {
    return new Promise<ReadableStream<Uint8Array>>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const arrayBuffer = this.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const readableStream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(uint8Array);
            controller.close();
          },
        });
        resolve(readableStream);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async pinFileToIPFS(file: Blob, fileName: string, authorWalletId: string, address: string) {
    let resData: any = '';
    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: fileName,
      author: authorWalletId,
      user: address,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    // Angular http
    try {
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + PinataCredentials.PINATA_JWT,
        },
        body: formData,
      });
      resData = await res.json();
      console.log(resData);

      // Save hash to ETH
      this.pinFileToEth(resData.IpfsHash, authorWalletId);
    } catch (error) {
      console.error(error);
    }
    return resData;
  }

  async pinFileToEth(cid: string, address: string) {
    console.info('pinning to etherum');
    const contract = new window.web3.eth.Contract(IpfsContract.abi as AbiItem[], ContractAddresses.IPFS_CONTRACT);
    const saveFile = async () => {
      const res = await contract.methods.storeCIDAndUserAddress(cid, address).send({ from: address });
      console.log(res);
    };
    saveFile();
  }

  async listDocuments() {
    //this.pinata!.pinList({});
  }
}
