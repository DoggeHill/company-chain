import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseObject } from "../shared/response-object";
import { User } from "./model/user";

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    constructor(private http: HttpClient) {
    }

    findUser(): Observable<ResponseObject<User>> {
        return this.http.get<ResponseObject<User>>('plant-protection-api/fer/');
      }
}