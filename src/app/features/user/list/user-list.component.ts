import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { Department } from 'src/app/model/department';
import { ListEmployee } from 'src/app/model/listEmployee';
import { Page } from 'src/app/model/page';
import { DepartmentService } from 'src/app/service/department.service';
import { AppConstants } from "../../../app-constants";
import { EmployeeService } from './../../../service/employee.service';
import { Detail } from "src/app/model/detail";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  listDepartment: Department[] = [];
  listEmployee: ListEmployee[] = [];

  loading: boolean = false;

  currentPage = 1;
  totalPages = 1;
  totalRecords = 0;
  offset = 1;
  limit = 5;

  employeeName: any;
  departmentId: any;
  ordEmployeeName = 'asc';
  ordCertificationName = '';
  ordEndDate = '';
  errorMessage: string | null = null;

  searchForm !: FormGroup;

  constructor(
    public http: HttpClient,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    // test call api auto inject token to header
    this.http.post(AppConstants.BASE_URL_API + "/test-auth", null).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      }
    });
    // Xoá session khi F5
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem('searchParams');
    });

    /**
     * Thực hiện tạo một form search
     */
    this.searchForm = this.fb.group({
      employeeName: [''],
      departmentId: [''],
    });
    this.getListEmployee();
    this.getListDepartment();

    // Lấy lại điều kiện sort,search,page khi back về ADM002
    const searchParams = JSON.parse(sessionStorage.getItem('searchParams') || '{}');
    this.employeeName = searchParams.employeeName || '';
    this.departmentId = searchParams.departmentId || '';
    this.ordEmployeeName = searchParams.ordEmployeeName || '';
    this.ordCertificationName = searchParams.ordCertificationName || '';
    this.ordEndDate = searchParams.ordEndDate || '';
    this.offset = searchParams.offset || 1;
    this.limit = searchParams.limit || 5;
    this.currentPage = this.offset / this.limit + 1;
    this.getListEmployee();
    this.getListDepartment();
    this.searchForm.controls['departmentId'].setValue(this.departmentId);
  }
  // Lưu điều kiện sort,search,page vào session khi component kết thúc vòng đời
  ngOnDestroy(): void {
    const searchParams = {
      employeeName: this.employeeName,
      departmentId: this.departmentId,
      ord_employee_name: this.ordEmployeeName,
      ordEmployeeName: this.ordCertificationName,
      ordEndDate: this.ordEndDate,
      offset: this.offset,
      limit: this.limit
    };
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
  }

  // Hiển thị danh sách employee
  getListEmployee(): void {
    this.loading = true;
    this.employeeService.getListEmployees(
      this.searchForm.get('employeeName')?.value,
      this.searchForm.get('departmentId')?.value,
      this.ordEmployeeName,
      this.ordCertificationName,
      this.ordEndDate,
      this.offset,
      this.limit,
    ).pipe(
      tap((data: Page) => {
        this.listEmployee = data.employees;
        this.totalPages = data.totalRecords;
        this.totalPages = Math.ceil(data.totalRecords / this.limit);
        this.errorMessage = null;
      }),
      catchError((er: any) => {
        this.listEmployee = [];
        this.errorMessage = ' Failed to get list of employees'
        return of(er);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  // Thực hiện search
  search(): void {
    this.offset = 1;
    this.employeeName = this.searchForm.controls['employeeName'].value;
    this.departmentId = this.searchForm.controls['departmentId'].value;
    this.getListEmployee();
  }

  // Lấy danh sách department
  getListDepartment(): void {
    this.departmentService.getListDepartment().subscribe(
      (data: any) => {
        this.listDepartment = data.department;
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  /**
   * Hàm này được gọi khi người dùng thay đổi cột để sắp xếp.
   * @param column Tên cột mà sắp xếp cần được áp dụng.
   */
  onSortChange(column: string) {
    if (column === 'employee_name') {
      // Chuyển đổi thứ tự sắp xếp cho cột 'employee_name'
      if (this.ordEmployeeName === 'asc') {
        this.ordEmployeeName = 'desc';
      } else {
        this.ordEmployeeName = 'asc';
      }
      // Đặt lại sắp xếp cho các cột khác
      this.ordCertificationName = '';
      this.ordEndDate = '';
    } else if (column === 'certification_name') {
      // Chuyển đổi thứ tự sắp xếp cho cột 'certification_name'
      if (this.ordCertificationName === 'asc') {
        this.ordCertificationName = 'desc';
      } else {
        this.ordCertificationName = 'asc';
      }
      // Đặt lại sắp xếp cho các cột khác
      this.ordEmployeeName = '';
      this.ordEndDate = '';
    } else if (column === 'end_date') {
      // Chuyển đổi thứ tự sắp xếp cho cột 'end_date'
      if (this.ordEndDate === 'asc') {
        this.ordEndDate = 'desc';
      } else {
        this.ordEndDate = 'asc';
      }
      // Đặt lại sắp xếp cho các cột khác
      this.ordCertificationName = '';
      this.ordEmployeeName = '';
    }
    // Cập nhật danh sách nhân viên với các tùy chọn sắp xếp mới
    this.getListEmployee();
  }

  // Thực hiện di chuyển page
  goToPage(page: number) {
    this.offset = (page - 1) * this.limit;
    this.offset = page;
    this.getListEmployee();
  }
}

