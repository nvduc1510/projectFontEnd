import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DEPARTMENT_API = 'http://localhost:8085/departments';
const httpOptions = {headers : new HttpHeaders ({ 'Content-Type' : 'application/json'})};
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http : HttpClient) { }
  /**
   * Gửi yêu cầu HTTPGet lấy API  trả về một Observable
   */
  getAllDepartment() : Observable<any>{
    const url = `${DEPARTMENT_API}`;
    return this.http.get(url);
  }
}
