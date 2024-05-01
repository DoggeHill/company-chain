import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Response } from '../shared/response';
import { TableSchema } from '../shared/table-schema';
import { Department } from '../shared/department';
import { Office } from '../shared/office';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor() {}

  listDepartments(): Observable<Response<Department[]>> {
    return from(window.db.prepare(`SELECT * from ${TableSchema.department}`).all()).pipe(
      map((res: any) => {
        res = res as Response<Department[]>;
        const response: Response<Department[]> = {
          success: res.success,
          meta: res.meta,
          error: res.error,
          results: res.results,
          responseMessage: 'department list fetched',
        };
        return response;
      })
    );
  }

  listOffices(): Observable<Response<Office[]>> {
    return from(window.db.prepare(`SELECT * from ${TableSchema.office}`).all()).pipe(
      map((res: any) => {
        res = res as Response<Office[]>;
        const response: Response<Office[]> = {
          results: res.results,
          success: res.success,
          meta: res.meta,
          error: res.error,
          responseMessage: 'office list fetched',
        };
        return response;
      })
    );
  }
}
