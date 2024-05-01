import 'zone.js';
import { MetaMaskInpageProvider } from "@metamask/providers";
import * as process from 'process';
import { Buffer } from 'buffer';

/**
 * To access Metamask and other services, we need to allow Angular 
 * to use global window object. 
 */
window.process = process;
(window as any).global = window;
global.Buffer = global.Buffer || Buffer;

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider | any,
      web3?: any,
      db?: any,
   }
}
