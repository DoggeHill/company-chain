import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { Observable, Subject, concat, concatMap, delay, filter, from, mergeMap, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CredentialsDialogComponent } from './credentials-dialog/credentials-dialog.component';
import { PinataCredentials, PinataConfigCid } from '../shared/pinata-credentials';
import { ContractAddresses } from '../shared/contract-addresses';
import { IpfsService } from '../services/ipfs.service';
import { openDB } from 'idb';
import { TableLandService } from '../services/table-land.service';
import { helpers } from '@tableland/sdk';
import { TableSchema } from '../user-management/model/table-schema';
import UserAccessControl from '../../assets/contracts/UserAccessControl.json'
import { AbiItem } from 'web3-utils'
import { Config } from '../shared/config';
import { MatSnackBar } from '@angular/material/snack-bar';

enum Steps {
  "config_loaded" = 0,
  "metamask_installed" = 1,
  "metamask_unlocked" = 2,
  "metamask_connected" = 3,
  "blockchain_connected" = 4,
  "ipfs_connected" = 5,
  "tableland_connected" = 6,
  "tableland_factory_init" = 7,
  "tableland_factory_done" = 8,
}

enum Errors {
  "metamask_not_installed" = 0,
  "metamask_locked" = 1,
  "metamask_not_connected" = 2,
  "blockchain_not_connected" = 3,
  "ipfs_not_connected" = 4,
  "table_land_not_connected" = 4,
}

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrl: './startup.component.scss',
})
export class StartupComponent implements OnInit {
   readonly _databaseName = "company-chain-config-db";
   readonly _storeName = "credentials";
   private _pinataConfigCid: string | null = null;
   public _dialogResult = new Subject<boolean>();

  progressBarValue :number = 0;
  class: string = '';
  step: string = '';

  tableLandFactory: boolean = false;
  destroy$ = new Subject();
  
  private errorMap: {error: string}[] = 
  [
    {
      error: 'Metamask not installed! ',
    },
    {
      error: 'Please unlock Metamask!',
    },
    {
      error: 'Please connect Metamask to this CompanyChain application!',
    },
    {
      error: 'Metamask is not connected to blockchain!',
    },
    {
      error: 'IPFS Pinata provider is not connected!',
    },
    {
      error: 'TableLand is not connected!',
    },
  ];

  private progressMap: {step: string, progress: number}[] = 
    [
      {
        step: 'Config loaded!',
        progress: 5,
      },
      {
        step: 'Metamask installed!',
        progress: 10,
      },
      {
        step: 'Metamask unlocked!',
        progress: 20,
      },
      {
        step: 'Metamask connected!',
        progress: 30,
      },
      {
        step: 'Blockchain paired',
        progress: 40,
      },
      {
        step: 'IPFS provider authenticated!',
        progress: 60,
      },
      {
        step: 'Tableland init done!',
        progress: 70,
      },
      {
        step: 'Tableland factory init!',
        progress: 80,
      },
      {
        step: 'Tableland factory done!',
        progress: 100,
      },
    ];  

  constructor(private metamaskService: Web3Service, public dialog: MatDialog,
    private ipfsService: IpfsService, 
    private tableLandService: TableLandService,
  ) {
  }

  private progress(index: number) {
    this.progressBarValue = this.progressMap[index].progress;
    this.step = this.progressMap[index].step;
    this.class = '';
  }

  private error(index: number) {
    this.step = this.errorMap[index].error;
    this.class = 'error';
    this.progressBarValue = 0;
  }

  public init(): Observable<any> {
    // User login process
    return this.loadConfigJson().pipe(takeUntil(this.destroy$), switchMap(res => {
      this.progress(Steps.config_loaded);

      return from(this.metamaskService.isMetamaskInstalled()).pipe(takeUntil(this.destroy$), delay(300), switchMap(res => {
          if(!res) {
            this.error(Errors.metamask_not_installed);
            throw("MetamaskNotInstalled");
          }
          this.progress(Steps.metamask_installed);

          return from(this.metamaskService.isMetamaskUnlocked()).pipe(takeUntil(this.destroy$), delay(300), switchMap(res => {
            if(!res) {
              this.error(Errors.metamask_locked);
              throw("MetamaskLocked");
            } 
            this.progress(Steps.metamask_unlocked);

            return from(this.metamaskService.connectMetamask()).pipe(takeUntil(this.destroy$), delay(300), switchMap(res => {
              if(!this.metamaskService.getConnectedAccount()) {
                this.error(Errors.metamask_not_connected);
                throw("MetamaskNotConnected");
              }
              this.progress(Steps.metamask_connected);

              return from(this.metamaskService.isBlockchainConnected()).pipe(takeUntil(this.destroy$), delay(300), switchMap(res => {
                if(!res) {
                  this.error(Errors.blockchain_not_connected);
                  throw("MetamaskNotConnectedToBlockchain");
                }
                this.progress(Steps.blockchain_connected);
                this.ipfsService.connect();
                
                return from(this.ipfsService.testConnection()).pipe(takeUntil(this.destroy$), delay(200), switchMap(res => {
                  if(!res?.authenticated) {
                    this.error(Errors.ipfs_not_connected);
                    throw("IPFSProviderNotAuthenticated");
                  }
                  this.progress(Steps.ipfs_connected);
                  
                  return from(this.tableLandService.connect()).pipe(takeUntil(this.destroy$), delay(300), switchMap(res => {
                    if(!res) {
                      this.error(Errors.table_land_not_connected);
                      throw("IPFSProviderNotAuthenticated");
                    }
                    this.progress(Steps.tableland_connected);

                    if(this.tableLandFactory) {
                      this.progress(Steps.tableland_factory_init);
                      return from(this.tableLandService.factory()).pipe(takeUntil(this.destroy$), delay(200),tap(res => {
                        this.progress(Steps.tableland_factory_done);
                      }));
                    } else {
                      this.progressBarValue = 100;
                      return of(null);
                    }
                }));
              }));
            }));
          }));
        }));
      }));
    }));
  }
  
  
  ngOnInit(): void {
    
  }

  private loadConfigJson(): Observable<any> {
    return from(this.checkPinataStoreName(this._storeName)).pipe(takeUntil(this.destroy$), switchMap((res, index) => {
      this.openCredentialsDialog();
      return this._dialogResult.pipe(takeUntil(this.destroy$), switchMap((res) => {
        return from(this.insertPinataCredentials(this._storeName)).pipe(
          takeUntil(this.destroy$), 
          switchMap((res) => {
            return from(this.ipfsService.downloadJSONfile(this._pinataConfigCid!)).pipe(
              takeUntil(this.destroy$), 
              tap((res) => {
                this.setLocalConfigurations(res as Config);
                console.log(res);
              }),
            );
          },
        ));
      }));
    }))
  } 


  async checkPinataStoreName(storeName: string): Promise<boolean> {
    try {
    const db = await openDB(this._databaseName);
    const exists:boolean = db.objectStoreNames.contains(storeName);
    db.close();
    return exists;
    }
    catch (error) {
      console.error('Error checking storeName:', error);
      return false;
    }
  }

  async insertPinataCredentials(storeName: string) {
    const dbPromise = openDB(this._databaseName, 2, {
      upgrade(db) {
        db.createObjectStore(storeName, { autoIncrement: true });
      },
    });
    
   // (await dbPromise).put(storeName, 'cid', this._pinataConfigCid!);
    (await dbPromise).close
  }

  openCredentialsDialog(): void {
    const dialogRef = this.dialog.open(CredentialsDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: PinataConfigCid)=> {
      if(result) {
        this._pinataConfigCid = result.cid;
        this._dialogResult.next(true);
      }
    });
  }

  private config() {
    const connectWeb3 = async () => {
      const data = await this.metamaskService.connectMetamask();
    // const factory = await this.tableLandService.factory();
     
      

      // TODO: history tab
      const eventBus = new helpers.TableEventBus(window.db.config);
      const listener = await eventBus.addListener(TableSchema.user); // Replace with your table name
      listener.on("change", function (event: any) {
        console.warn("Transfer: ", event);
      });
      
      
      return data;
    };
    connectWeb3().then(() => {
      //this.isLoaded.next(true);
      //this.resetRoles();
    });
    this.tableLandService.connect();
  }

  private setLocalConfigurations(res: Config) {
    PinataCredentials.PINATA_API_KEY = res.PINATA_API_KEY;
    PinataCredentials.PINATA_JWT = res.PINATA_API_JWT;
    PinataCredentials.PINATA_SECRET = res.PINATA_API_SECRET;

    ContractAddresses.IPFS_CONTRACT = res.FILE_STORAGE_CONTRACT_ADDRESS;
    ContractAddresses.USER_ACCESS_CONTRACT = res.USER_ACCESS_CONTROL_CONTRACT_ADDRESS;

    this.tableLandFactory = res.TABLELAND_FACTORY;
  }


  // admin grant access to himself
  resetRoles() {
    const contract = new window.web3.eth.Contract(UserAccessControl.abi as AbiItem[], ContractAddresses.USER_ACCESS_CONTRACT);
    const refreshTickets = async () => {
        await contract.methods.grantMinterRole(this.metamaskService.getConnectedAccount()).send({from: this.metamaskService.getConnectedAccount()});
    };
    refreshTickets().then((res) => {
      console.log(res);
    }).catch((e) => console.log(e));
  }
}
