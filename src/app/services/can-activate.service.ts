import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import UserAccessControl from '../../assets/contracts/UserAccessControl.json';
import { AbiItem } from 'web3-utils';
import { Observable, catchError, delay, from, of, switchMap, throwError } from 'rxjs';
import { ContractAddresses } from '../shared/contract-addresses';
import { Web3Service } from './web3.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthorized = true;
  constructor(private router: Router, private snackBar: MatSnackBar, private web3: Web3Service) {}

  grantDefaultMinter() {
    const contract = new window.web3.eth.Contract(
      UserAccessControl.abi as AbiItem[],
      ContractAddresses.USER_ACCESS_CONTRACT
    );
    contract.methods
      .grantMinterRole(ContractAddresses.USER_ACCESS_CONTRACT_DEPLOYER_ADDRESS)
      .send({ from: this.web3.getConnectedAccount() });
  }

  getPermission(): Observable<boolean> {
    if (window.web3 === undefined || window.web3.eth === undefined) return of(false);
    const contract = new window.web3.eth.Contract(
      UserAccessControl.abi as AbiItem[],
      ContractAddresses.USER_ACCESS_CONTRACT
    );
    return from(contract.methods.isMinter().call({ from: this.web3.getConnectedAccount() })).pipe(
      switchMap((res: any) => {
        return of(res as boolean);
      }),
      catchError((error: any) => {
        console.error('Error while calling isMinter:', error);
        this.snackBar.open('User is not admin!', 'Close', {
          duration: 2000, // Set the duration in milliseconds
        });
        return throwError('Error occurred while checking permission');
      })
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.getPermission().pipe(
      delay(300),
      switchMap((res) => {
        if (res === true) {
          return of(true);
        } else {
          this.snackBar.open('User is not admin!', 'Close', {
            duration: 2000, // Set the duration in milliseconds
          });
          return of(false);
        }
      })
    );
  }
}
