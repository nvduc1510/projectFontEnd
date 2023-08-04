import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDateService {
  errorMessage!: string;
  employeeFormValue: any;
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  /**
   * Cập nhật lại dữ liệu
   * @param data tham số dữ liệu mới
   */
  setData(data: any) {
    this.dataSubject.next(data);
  }

  /**
   * @param data tham số truyền vào
   * return giá trị hiện tại
   */
  getData(): any {
    return this.dataSubject.getValue();
  }

  constructor() { }
}