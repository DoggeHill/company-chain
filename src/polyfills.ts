import 'zone.js';
import { MetaMaskInpageProvider } from "@metamask/providers";


import * as process from 'process';
import { Buffer } from 'buffer';

window.process = process;
(window as any).global = window;
global.Buffer = global.Buffer || Buffer;

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider | any,
      web3?: any,
      db?: any,
      loaded?: boolean,
   }
}
