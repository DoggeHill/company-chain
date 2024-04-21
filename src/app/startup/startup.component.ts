import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { openDB } from 'idb';
import { Web3Service } from '../services/web3.service';
import { from, take, tap } from 'rxjs';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrl: './startup.component.scss',
})
export class StartupComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  constructor(private metamaskService: Web3Service) {
  }
  
  
  ngOnInit(): void {

    from(this.metamaskService.isMetamaskInstalled()).pipe(take(1), tap(res => {
      console.log("installed");
      this.value = 2;
    })).subscribe()

    from(this.metamaskService.isMetamaskUnlocked()).pipe(take(1), tap(res => {
      console.log("unlocked");
      this.value = 5;
    })).subscribe()

    from(this.metamaskService.connectMetamask()).pipe(take(1), tap(res => {
      console.log("connected");
      this.value = 10;
    })).subscribe()

    from(this.metamaskService.isBlockchainConnected()).pipe(take(1), tap(res => {
      console.log("blockchain paired");
      this.value = 20;
    })).subscribe()




  }

  async useDB() {
    // Returns a promise, which makes `idb` usable with async-await.
    const dbPromise = await openDB('company-chain-config-db',1, {
      
    });
  }
}
