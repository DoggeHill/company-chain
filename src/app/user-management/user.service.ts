import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Address, User } from './model/user';
import { TableSchema } from '../shared/table-schema';
import { Employee } from './model/employee';
import { Response } from '../shared/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private constructAddress(res: any): string {
    return res.city + ' ' + res.street + ' ' + res.streetNo + ' ' + res.zipCode;
  }

  listUsers(): Observable<Response<User[]>> {
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
        res = res as Response<User[]>;
        res.results.forEach((element: any) => {
          element.address = this.constructAddress(element);
        });
        const response: Response<User[]> = {
          results: res.results,
          success: res.success,
          meta: res.meta,
          error: res.error,
          responseMessage: 'user list fetched',
        };
        return response;
      })
    );
  }

  findUser(id: number): Observable<Response<User>> {
    return from(
      window.db.prepare(`SELECT * from ${TableSchema.user} where id = ${id};`).all()
    ).pipe(
      map((result: any) => {
        const response: Response<User> = {
          results: result.results[0] as User,
          success: result.success,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user fetched',
        };
        return response;
      })
    );
  }

  findEmployee(id: number): Observable<Response<Employee>> {
    return from(
      window.db.prepare(`SELECT * from ${TableSchema.employee} where id = ${id};`).all()
    ).pipe(
      map((res: any) => {
        const response: Response<Employee> = {
          results: res.results[0] as Employee,
          success: res.success,
          meta: res.meta,
          error: res.error,
          responseMessage: 'employee fetched',
        };
        return response;
      })
    );
  }

  editUser(user: User): Observable<Response<number>> {
    return from(
      window.db.batch([
        window.db.prepare(
          `UPDATE ${TableSchema.user} set firstName = '${user.firstName}', lastName = '${user.lastName}', birthDay = '${user.birthDay}', sex = '${user.sex}', notes = '${user.notes}' where id = ${user.id};`
        ),
        window.db.prepare(
          `UPDATE ${TableSchema.address} set country = '${user.address?.country}', city = '${user.address?.city}', street = '${user.address?.street}', streetNo = '${user.address?.streetNo}', zipCode = '${user.address?.zipCode}'  where id = ${user.address?.id};`
        ),
      ])
    ).pipe(
      map((result: any) => {
        const response: Response<number> = {
          results: user.id,
          success: result[0].success ? result[0].success : result[0].error,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user edited',
        };
        return response;
      })
    );
  }

  deleteUser(user: User): Observable<Response<number>> {
    return from(
      window.db.batch([
        window.db.prepare(`DELETE FROM ${TableSchema.user} where id = ${user.id}`),
        window.db.prepare(`DELETE FROM ${TableSchema.employee} where id = ${user.employeeId}`),
        window.db.prepare(`DELETE FROM ${TableSchema.address} where id = ${user.addressId}`),
      ])
    ).pipe(
      map((result: any) => {
        const response: Response<number> = {
          results: user.id,
          success: result.success,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user deleted',
        };
        return response;
      })
    );
  }

  findUserAddress(id: number): Observable<Response<Address>> {
    return from(
      window.db.prepare(`SELECT * from ${TableSchema.address} where id = ${id};`).all()
    ).pipe(
      map((data: any) => {
        const response: Response<Address> = {
          results: data.results[0] as Address,
          success: data.success,
          meta: data.meta,
          error: data.error,
          responseMessage: 'address fetched',
        };
        return response;
      })
    );
  }

  createUser(dto: User): Observable<Response<User>> {
    return from(
      window.db
        .prepare(
          `INSERT INTO users_31337_22 (id, name, surname, date_of_birth, sex, addressId) VALUES (?, ?, ?, ?, ?, ?);`
        )
        .bind(dto.id, dto.firstName, dto.lastName, dto.birthDay, dto.sex, dto.address)
        .run()
    ).pipe(
      map((rows) => {
        let newRows = rows as unknown as any;
        let data = newRows.results[0];
        const response: Response<User> = {
          results: data as User,
          success: data.success,
          meta: data.meta,
          error: data.error,
          responseMessage: 'user fetched',
        };
        return response;
      })
    );
  }

  editEmployee(employee: Employee): Observable<Response<number>> {
    return from(
      window.db
        .prepare(
          `UPDATE ${TableSchema.employee} set officeId = '${employee.officeId}', departmentId = '${employee.departmentId}' where id = ${employee.id}`
        )
        .all()
    ).pipe(
      map((result: any) => {
        const response: Response<number> = {
          results: employee.id,
          success: result.success ? result.success : result.error,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user edited',
        };
        return response;
      })
    );
  }

  grantAccessToAllTables(address: string): Observable<Response<any>> {
    return from(
      window.db.batch([
        window.db.prepare(`GRANT INSERT, UPDATE, DELETE ON ${TableSchema.user} TO '${address}'`),
        window.db.prepare(`GRANT INSERT, UPDATE, DELETE ON ${TableSchema.address} TO '${address}'`),
        window.db.prepare(`GRANT INSERT, UPDATE, DELETE ON ${TableSchema.department} TO '${address}'`),
        window.db.prepare(`GRANT INSERT, UPDATE, DELETE ON ${TableSchema.employee} TO '${address}'`),
        window.db.prepare(`GRANT INSERT, UPDATE, DELETE ON ${TableSchema.office} TO '${address}'`),
      ])
    ).pipe(
      map((result: any) => {
        const response: Response<number> = {
          results: result,
          success: result.success,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user access granted to ' + address,
        };
        return response;
      })
    );
  }

  revokeAccessFromAllTables(address: string): Observable<Response<any>> {
    return from(
      window.db.batch([
        window.db.prepare(`REVOKE INSERT, UPDATE, DELETE ON ${TableSchema.user} FROM '${address}'`),
        window.db.prepare(`REVOKE INSERT, UPDATE, DELETE ON ${TableSchema.address} FROM '${address}'`),
        window.db.prepare(`REVOKE INSERT, UPDATE, DELETE ON ${TableSchema.department} FROM '${address}'`),
        window.db.prepare(`REVOKE INSERT, UPDATE, DELETE ON ${TableSchema.employee} FROM '${address}'`),
        window.db.prepare(`REVOKE INSERT, UPDATE, DELETE ON ${TableSchema.office} FROM '${address}'`),
      ])
    ).pipe(
      map((result: any) => {
        const response: Response<number> = {
          results: result,
          success: result.success,
          meta: result.meta,
          error: result.error,
          responseMessage: 'user access revoked to ' + address,
        };
        return response;
      })
    );
  }
}
