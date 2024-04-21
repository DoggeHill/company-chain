import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TableLandService } from './services/table-land.service'
import { Web3Service } from './services/web3.service';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import UserAccessControl from '../assets/contracts/UserAccessControl.json'
import { AbiItem } from 'web3-utils'
import { ContractAddresses } from './shared/contract-addresses';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  links = [
    { href: '/', name: 'Dashboard', isActive: true, icon: 'assignment' },
    { href: 'user-list', name: 'User list', isActive: true, icon: 'person' },
  ];
  isLoaded = new BehaviorSubject(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public metamask: Web3Service,
    private tableLandService: TableLandService,
  ) { }

  ngOnInit(): void {
    const connectWeb3 = async () => {
      const data = await this.metamask.connectMetamask();
      //   const factory = await this.tableLandService.factory();
      const db = this.tableLandService.connect();
      return data;
    };
    connectWeb3().then(() => {
      this.isLoaded.next(true);
      //this.resetRoles();
    });
    this.tableLandService.connect();
    
  }

  // admin grant access to himself
  resetRoles() {
    const contract = new window.web3.eth.Contract(UserAccessControl.abi as AbiItem[], ContractAddresses.userAccessControlContractAddress);
    const refreshTickets = async () => {
        await contract.methods.grantMinterRole(this.metamask.getConnectedAccount()).send({from: this.metamask.getConnectedAccount()});
    };
    refreshTickets().then((res) => {
      console.log(res);
    }).catch((e) => console.log(e));
  }
  
  onActivate() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}
