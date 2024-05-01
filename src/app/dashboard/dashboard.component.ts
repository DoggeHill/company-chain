import { Component, } from '@angular/core';
import { deleteDB, openDB } from 'idb';
import { from, take } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
})
export class DashboardComponent  {
  private readonly _databaseName = "company-chain-config-db";
  private readonly _storeName = "credentials";
  cid: string = '';

  constructor() {
    from(this.configFromDb()).pipe(take(1)).subscribe(r => {
      this.cid = r;
    })
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
