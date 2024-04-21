import { Injectable } from "@angular/core";
import { Observable, from, map } from "rxjs";
import { ResponseObject } from "../shared/response-object";
import { Response } from "../shared/response";
import { TableSchema } from "../user-management/model/table-schema";
import { Department } from "../user-management/model/department";
import { Office } from "../user-management/model/office";


@Injectable({
    providedIn: 'root'
  })
  export class RegisterService {
    constructor() {
    }

    listDepartments(): Observable<ResponseObject<Department[]>> {
        return from(window.db.prepare(`SELECT * from ${TableSchema.department}`).all()).pipe(
          map((res: any) => {
            res = res as Response<Department[]>;
            const responseObject: ResponseObject<Department[]> = {
              responseData: res.results,
              success: res.success,
              responseMessages: [],
              responseMessage: "department list fetched",
            };
            return responseObject;
          })
        );
      }

      listOffices(): Observable<ResponseObject<Office[]>> {
        return from(window.db.prepare(`SELECT * from ${TableSchema.office}`).all()).pipe(
          map((res: any) => {
            res = res as Response<Office[]>;
            const responseObject: ResponseObject<Office[]> = {
              responseData: res.results,
              success: res.success,
              responseMessages: [],
              responseMessage: "office list fetched",
            };
            return responseObject;
          })
        );
      }
}