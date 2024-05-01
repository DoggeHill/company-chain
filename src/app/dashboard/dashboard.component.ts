import { Component, } from '@angular/core';
import { deleteDB, openDB } from 'idb';
import { combineLatest, from, take } from 'rxjs';
import { RegisterService } from '../services/register.service';
import { Department } from '../shared/department';
import { Office } from '../shared/office';
import { User } from '../user-management/model/user';
import { UserService } from '../user-management/user.service';
import { IpfsService } from '../services/ipfs.service';
import { IpfsFile } from '../shared/ipfs-file';

@Component({
  selector: 'my-app',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
})
export class DashboardComponent  {
  private readonly _databaseName = "company-chain-config-db";
  private readonly _storeName = "credentials";
  cid: string = '';
  departments: Department[] = [];
  offices: Office[] = [];
  users: User[] = [];
  files: IpfsFile[] = [];

  constructor(private registers: RegisterService, private userService: UserService, private ipfsService: IpfsService) {
    from(this.configFromDb()).pipe(take(1)).subscribe(r => {
      this.cid = r;
    });

    combineLatest([registers.listDepartments(), registers.listOffices(), userService.listUsers(), from(ipfsService.listAllFiles())]).subscribe(
      ([deps, offs, users, files]) => {
        this.departments = deps.results;
        this.offices = offs.results;
        this.users = users.results;
        // @ts-ignore
        this.files = files[0] as IpfsFile[];
      }
    );
  }

  private async configFromDb() {
    const db = await openDB(this._databaseName); 
    return db.transaction(this._storeName).objectStore(this._storeName).get('cid'); 
  }

  async deleteIndexDb() {
    await deleteDB(this._databaseName); 
    window.location.reload();
  }

  sendEmail() {
    window.location = "mailto:patrikhyll@gmail.com" as any; 
  }
}
