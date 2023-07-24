import { catchError, finalize, of, tap } from 'rxjs';
import { EmployeeService } from './../../../service/employee.service';
import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppConstants } from "../../../app-constants";
import { ListEmployee } from 'src/app/model/listEmployee';
import { Department } from 'src/app/model/department';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Page } from 'src/app/model/page';
import { DepartmentService } from 'src/app/service/department.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  listDepartment : Department[] = [];
  listEmployee : ListEmployee[] = [];
  
  loading: boolean = false;

  totalPages = 0;
  totalRecords = 0;
  offset = 1;
  limit = 20;

  employeeName : any;
  departmentId : any;
  ordEmployeeName  = 'asc';
  ordCertificationName = '';
  ordEndDate = '';
  errorMessage : string | null = null;

  searchForm !: FormGroup;
  constructor(
    public http: HttpClient,
    private employeeService :EmployeeService,
    private departmentService : DepartmentService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {

    // test call api auto inject token to header
    this.http.post(AppConstants.BASE_URL_API + "/test-auth", null)
    .subscribe({
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

    /**
     * Thực hiện tạo một form search
     */
    this.searchForm = this.fb.group({
      employeeName: [''],
      departmentId: [''],
    });
    this.getListEmployee();
    this.getListDepartment();
  }

  /**
   * Thực hiện hiển thị employee
   */
  getListEmployee() : void {
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
      tap((data : Page) =>{
        this.listEmployee = data.employees;
        this.totalPages = data.totalRecords;
        this.totalPages = Math.ceil(data.totalRecords / this.limit);
        this.errorMessage = null;
      }),
      catchError((er : any) => {
        this.listEmployee = [];
        this.errorMessage = ' Failed to get list of employees'
        return of(er);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  search(): void {
    this.offset = 1;
    this.employeeName = this.searchForm.controls['employeeName'].value;
    this.departmentId = this.searchForm.controls['departmentId'].value;
    this.getListEmployee();
  }
  getListDepartment() {
    this.departmentService.getListDepartment().subscribe(params => {
      this.listDepartment = params;
    });
  }

  onSortChange(column: string) {
    if (column === 'employee_name') {
      if (this.ordEmployeeName === 'asc') {
        this.ordEmployeeName = 'desc';
      } else {
        this.ordEmployeeName = 'asc';
      }
      this.ordCertificationName = '';
      this.ordEndDate = '';
    } else if (column === 'certification_name') {
      if (this.ordCertificationName === 'asc') {
        this.ordCertificationName = 'desc';
      } else {
        this.ordCertificationName = 'asc';
      }
      this.ordEmployeeName = '';
      this.ordEndDate = '';
    } else if (column === 'end_date') {
      if (this.ordEndDate === 'asc') {
        this.ordEndDate = 'desc';
      } else {
        this.ordEndDate = 'asc';
      }
      this.ordCertificationName = '';
      this.ordEmployeeName = '';
    }
    this.getListEmployee();
  }

  resetPage() {
    this.offset = 1;
  }
  goToPage(page: number) {
    this.employeeName = this.searchForm.controls['employeeName'].value;
    this.departmentId = this.searchForm.controls['departmentId'].value;
    console.log(this.employeeName)
    if (page !== 1 && (this.employeeName || this.departmentId)) {
      this.offset = 1; // Đặt trang về trang đầu
    } else {
      this.offset = page;
    }
    this.offset = page - 1;
    this.offset = page;
    this.employeeService.getListEmployees(
      this.employeeName,
      this.departmentId,
      this.ordEmployeeName,
      this.ordCertificationName,
      this.ordEndDate,
      this.offset,
      this.limit
    ).subscribe(data => {
      this.listEmployee = data.employees;
    })
  }
  }

