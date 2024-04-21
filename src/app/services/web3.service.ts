import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private _connectedAccount: string = '';

  constructor() {}
  /**
   * Gets info
   * For logging purposes, we trace some info like our web3 version
   *  what type of network and all the accounts we set up in hardhat
   */
  async getInfo() {
    const network = await window.web3.eth.net.getNetworkType();
    const accounts = await window.web3.eth.getAccounts();
    console.log(`Web3 version ${Web3.version}`);
    console.log(`Network ${network}`);
    console.log(`Accounts`, accounts);
  }

  /**
   * Gets balance
   * "Show me the money" function allow us to check the balance belonging to an address. Take care, that we should convert from Weis
   * @param address
   * @returns
   */
  async getBalance(address: string) {
    console.log(address);
    const balance = await window.web3.eth.getBalance(address);
    console.log(`${balance} ETH`);
    return Web3.utils.fromWei(balance, 'ether');
  }

  getConnectedAccount(): string {
    return this._connectedAccount;
  }

  /**
   * Determines whether metamask installed is
   * @returns
   */
  isMetamaskInstalled() {
    return of((window as any).ethereum);
  }

  async connectMetamask() {
    //check metamask is installed
    if (window.ethereum) {
      //await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      // instantiate Web3 with the injected provider
      const web3 = window.web3;
      window.loaded = true;
      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      this._connectedAccount = accounts[0];
      console.info(this._connectedAccount, 'Metamask account');
    } else {
      alert('Please download metamask');
    }
  }

  /**
   * Determines whether metamask is unlocked
   * @returns
   */
  async isMetamaskUnlocked() {
    return of((window as any).ethereum._metamask.isUnlocked());
  }

  /**
   * Determines whether metamask is connected to blockchain
   * @returns
   */
  async isBlockchainConnected() {
    return of((window as any).ethereum.isConnected());
  }
}
