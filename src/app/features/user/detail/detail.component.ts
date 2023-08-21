import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Detail } from 'src/app/model/detail';
import { EmployeeService } from 'src/app/service/employee.service';
import { ShareDateService } from 'src/app/service/share-date.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  employee!: Detail;
  employeeId!: number;

  certification : any; 

  isForm = false;

  selectedEmployee: any;

  errorMes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private shareData : ShareDateService) { }

  ngOnInit(): void {
    // lấy employee qua employeeId truyền sang
    this.employeeId = history.state.employeeId;
    this.employeeService.getEmployeeById(this.employeeId).subscribe ({
      next : data => {
        this.employee = data;
        this.certification = this.employee?.certifications;
      }
    })
  }
  // hiển thị form thông báo xác nhận xoá
  click() {
    this.isForm = true;
  }
  // Thoát khỏi form thông báo xác nhận xoá
  cancelForm() {
    this.isForm = false;
  }
  // Thực hiện xoá 1 employee
  deleteEmployee() {
    // Kiểm tra xem có tồn tại employeeId để xóa hay không.
    if (this.employee.employeeId) {
      // Gọi employeeService để xóa nhân viên bằng cách sử dụng employeeId.
      this.employeeService.deleteEmployee(this.employee.employeeId).subscribe({
        next: res => {
            this.router.navigate(['user/complete'], { state: { messageInf: res.message.params } });

        }, error :(error: HttpErrorResponse) => {
            if(error.status === 500) {
              this.isForm = false;
              this.errorMes = error.error.message.params;
            } else {
              const message = "システムエラーが発生しました。"
              this.router.navigate(['system-error'], {state: {messageInf : message}})
            }
            
          
        }
      });
    }
  }
  directionData(employeeId: any) {
    this.router.navigate(['/user/add'], { state: { employeeId } });
  }
}