import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DEPARTMENT_API = 'http://localhost:8085/department';
const httpOptions = {headers : new HttpHeaders ({ 'Content-Type' : 'application/json'})};
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http : HttpClient) { }

  getListDepartment() : Observable<any>{
    return this.http.get<any>(DEPARTMENT_API, httpOptions);
  }
}
