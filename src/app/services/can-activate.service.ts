import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import UserAccessControl from '../../assets/contracts/UserAccessControl.json'
import { AbiItem } from 'web3-utils'
import { Web3Service } from './web3.service';
import { Observable, delay, from, map, of, switchMap } from 'rxjs';
import { ContractAddresses } from '../shared/contract-addresses';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    isAuthorized = true;
    constructor(
        private router: Router,
        private metamaskService: Web3Service,
        private act: ActivatedRoute
    ) {
    }

    getPermission(): Observable<boolean> {
        const contract = new window.web3.eth.Contract(UserAccessControl.abi as AbiItem[], ContractAddresses.userAccessControlContractAddress);

        return from(contract.methods.isMinter().send({from: this.metamaskService.getConnectedAccount()})).pipe(
            delay(2000),
            map((res) => {
                console.log(res);
                return this.isAuthorized;
            })
        );
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.log("CanActivate Guard executed");
        return this.getPermission().pipe(
            switchMap(res => {
                if (res === true) {
                    console.log('Authorized');
                    return of(true);
                } else {
                    console.log('Not authorized');
                    this.router.navigate(["/"]);
                    return of(false);
                }
            })
        );
    }

}