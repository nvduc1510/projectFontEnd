import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { Department } from 'src/app/model/department';
import { ListEmployee } from 'src/app/model/listEmployee';
import { Page } from 'src/app/model/page';
import { DepartmentService } from 'src/app/service/department.service';
import { AppConstants } from "../../../app-constants";
import { EmployeeService } from './../../../service/employee.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  listDepartment: Department[] = [];
  listEmployee: ListEmployee[] = [];

  loading: boolean = false;

  //List employee, arrange,page
  employeeName : any;
  departmentId : any;
  ordEmployeeName = '';
  ordCertificationName = '';
  ordEndDate = '';
  errorMessage : string | null = null;
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;
  offset = 1;
  limit = 20;
  
  //search
  searchForm !: FormGroup;

  // Auto focus hạng mục đầu
  @ViewChild('firstElement') firstElement: ElementRef | undefined;
  ngAfterViewInit() {
    if (this.firstElement) {
      this.firstElement.nativeElement.focus();
    }
  }
  constructor(
    public http: HttpClient,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      employeeName: [''],
      departmentId: [''],
    });
  }

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

    this.getListEmployee();
    this.getAllDepartment();

    // Lấy lại điều kiện sort,search,page khi back về ADM002
    const searchParams = JSON.parse(sessionStorage.getItem('searchParams') || '{}');
    this.employeeName = searchParams.employeeName || '';
    this.departmentId = searchParams.departmentId || '';
    this.ordEmployeeName = searchParams.ordEmployeeName || '';
    this.ordCertificationName = searchParams.ordCertificationName || '';
    this.ordEndDate = searchParams.ordEndDate || '';
    this.offset = searchParams.offset || 1;
    this.limit = searchParams.limit || 20;
    this.currentPage = this.offset / this.limit + 1;
    this.getListEmployee();
    this.getAllDepartment();
    
  }
  // Lưu điều kiện sort,search,page vào session khi component kết thúc vòng đời
  ngOnDestroy(): void {
    const searchParams = {
      employeeName: this.employeeName,
      departmentId: this.departmentId,
      orderEmployeeName: this.ordEmployeeName,
      ordCertificationName: this.ordCertificationName,
      ordEndDate: this.ordEndDate,
      offset: this.offset,
      limit: this.limit,
    };
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
  }

    // Lấy danh sách department
    getAllDepartment() {
      this.departmentService.getAllDepartment().subscribe(
        (data: any) => {
          this.listDepartment = data.department;
        },
        (error) => {
          console.error('部門を取得できません ', error);
        }
      );
    }

  // Hiển thị danh sách employee
  getListEmployee(): void {
    this.loading = true;
    this.employeeService.getAllEmployee(
      this.searchForm.get('employeeName')?.value,
      this.searchForm.get('departmentId')?.value,
      this.ordEmployeeName,
      this.ordCertificationName,
      this.ordEndDate,
      this.offset,
      this.limit
    ) .subscribe ({
      next : (data : any) => {
        this.listEmployee = data.employees;
        this.totalRecords = data.totalRecords;
        this.totalPages = Math.ceil(data.totalRecords / this.limit);
        if(this.totalRecords == 0) {
          this.loading = true;
          this.errorMessage = "検索条件に該当するユーザが見つかりません。"
        } else {
          this.loading = false;
        }
      }, error:() => {
        const message = "システムエラーが発生しました。";
        this.router.navigate(['/system-error'], {state: {messageInf: message}})
      } 
    })
  }

  // Thực hiện search
  search() : void {
    this.currentPage = 1; 
    this.offset = 1; 
    this.employeeName = this.searchForm.controls['employeeName'].value;
    this.departmentId = this.searchForm.controls['departmentId'].value;
    this.getListEmployee();
  }

  /**
   * Hàm này được gọi khi người dùng thay đổi cột để sắp xếp.
   * @param column Tên cột mà sắp xếp cần được áp dụng.
   */
  onSortChange(column : string) {
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

