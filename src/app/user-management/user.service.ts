import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, from, map, take } from 'rxjs';
import { ResponseObject } from '../shared/response-object';
import { Address, User } from './model/user';
import { create } from '@tableland/sdk/dist/esm/registry/create';
import { Response } from './model/response';
import { TableSchema } from './model/table-schema';
import { Employee } from './model/employee';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private constructAddress(res: any): string {
    return res.city + ' ' + res.street + ' ' + res.streetNo + ' ' + res.zipCode;
  }

  listUsers(): Observable<ResponseObject<User[]>> {
    return from(
      window.db
        .prepare(
          `
    SELECT * from ${TableSchema.user}
    join ${TableSchema.address} on ${TableSchema.address}.id = addressId
    join ${TableSchema.employee} on ${TableSchema.user}.employeeId = ${TableSchema.employee}.id
    join ${TableSchema.department} on ${TableSchema.employee}.departmentId = ${TableSchema.department}.id
    join ${TableSchema.office} on ${TableSchema.employee}.officeId = ${TableSchema.office}.id
    `
        )
        .all()
    ).pipe(
      map((res: any) => {
        console.log(res);
        res = res as Response<User[]>;
        res.results.forEach((element: any) => {
          element.address = this.constructAddress(element);
        });
        const responseObject: ResponseObject<User[]> = {
          responseData: res.results,
          success: res.success,
          responseMessages: [],
          responseMessage: 'user list fetched',
        };
        console.log(responseObject);
        return responseObject;
      })
    );
  }

  findUser(id: number): Observable<ResponseObject<User>> {
    return from(window.db.prepare(`SELECT * from ${TableSchema.user} where id = ${id};`).all()).pipe(
      map((rows: any) => {
        let newRows = rows;
        let data = newRows.results[0];
        const responseObject: ResponseObject<User> = {
          responseData: data as User,
          success: true,
          responseMessages: [],
          responseMessage: 'user fetched',
        };
        return responseObject;
      })
    );
  }

  findEmployee(id: number): Observable<ResponseObject<Employee>> {
    return from(window.db.prepare(`SELECT * from ${TableSchema.employee} where id = ${id};`).all()).pipe(
      map((rows: any) => {
        let newRows = rows;
        let data = newRows.results[0];
        const responseObject: ResponseObject<Employee> = {
          responseData: data as Employee,
          success: true,
          responseMessages: [],
          responseMessage: 'employee fetched',
        };
        return responseObject;
      })
    );
  }

  editUser(user: User): Observable<ResponseObject<number>> {
    return from(
      window.db
        .batch([
          window.db.prepare(`UPDATE ${TableSchema.user} set firstName = '${user.firstName}', lastName = '${user.lastName}', birthDay = '${user.birthDay}', sex = '${user.sex}', notes = '${user.notes}' where id = ${user.id};`),
          window.db.prepare(`UPDATE ${TableSchema.address} set country = '${user.address?.country}', city = '${user.address?.city}', street = '${user.address?.street}', streetNo = '${user.address?.streetNo}', zipCode = '${user.address?.zipCode}'  where id = ${user.address?.id};`),
        ])
    ).pipe(
      delay(500),
      map((result: any) => {
        const responseObject: ResponseObject<number> = {
          responseData: user.id,
          success: result[0].success ? result[0].success : result[0].error,
          responseMessages: [],
          responseMessage: 'user edited',
        };
        return responseObject;
      })
    );
  }

  deleteUser(user: User): Observable<ResponseObject<number>> {
    return from(
      window.db
        .prepare(
          `DELETE FROM ${TableSchema.user} where id = ${user.id}; 
           DELETE FROM ${TableSchema.employee} where id = ${user.employeeId};
           DELETE FROM ${TableSchema.address} where id = ${user.addressId};`
        )
        .all()
    ).pipe(
      map((result: any) => {
        const responseObject: ResponseObject<number> = {
          responseData: user.id,
          success: result.success ? result.success : result.error,
          responseMessages: [],
          responseMessage: 'user deleted',
        };
        return responseObject;
      })
    );
  }

  findUserAddress(id: number): Observable<ResponseObject<Address>> {
    return from(window.db.prepare(`SELECT * from ${TableSchema.address} where id = ${id};`).all()).pipe(
      map((rows) => {
        let newRows = rows as unknown as any;
        let data = newRows.results[0];
        const responseObject: ResponseObject<Address> = {
          responseData: data as Address,
          success: true,
          responseMessages: [],
          responseMessage: 'address fetched',
        };
        return responseObject;
      })
    );
  }

  createUser(dto: User): Observable<ResponseObject<User>> {
    return from(window.db.prepare(`INSERT INTO users_31337_22 (id, name, surname, date_of_birth, sex, addressId) VALUES (?, ?, ?, ?, ?, ?);`).bind(dto.id, dto.firstName, dto.lastName, dto.birthDay, dto.sex, dto.address).run()).pipe(
      map((rows) => {
        let newRows = rows as unknown as any;
        let data = newRows.results[0];
        const responseObject: ResponseObject<User> = {
          responseData: data as User,
          success: true,
          responseMessages: [],
          responseMessage: 'user fetched',
        };
        return responseObject;
      })
    );
  }

  editEmployee(employee: Employee): Observable<ResponseObject<number>> {
    return from(window.db.prepare(`UPDATE ${TableSchema.employee} set officeId = '${employee.officeId}', departmentId = '${employee.departmentId}' where id = ${employee.id}`).all()).pipe(
      map((result: any) => {
        const responseObject: ResponseObject<number> = {
          responseData: employee.id,
          success: result.success ? result.success : result.error,
          responseMessages: [],
          responseMessage: 'user edited',
        };
        return responseObject;
      })
    );
  }
}
