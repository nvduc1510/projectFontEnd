import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Detail } from 'src/app/model/detail';
import { EmployeeService } from 'src/app/service/employee.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent{
  employee!: Detail;
  a : any;
  certification: any;

  isForm = false;

  selectedEmployee : any;

  errorMes : string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService) { }

    ngOnInit(): void {
      this.route.params.subscribe((params) => {
        const employeeId = params['employeeId'];
        this.getEmployeeInfoById(employeeId);
      });
   }

  getEmployeeInfoById(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(
      (data: Detail) => {
        this.employee = data;
        this.certification = this.employee?.certifications;
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  } 
  click() {
    this.isForm = true;
  }
  cancelForm() {
    this.isForm = false;
  }

  /**
   * Phương thức này dùng để xóa thông tin của một nhân viên.
   */
  deleteEmployee() {
    // Kiểm tra xem có tồn tại employeeId để xóa hay không.
    if (this.employee.employeeId) {
      // Gọi employeeService để xóa nhân viên bằng cách sử dụng employeeId.
      this.employeeService.deleteEmployee(this.employee.employeeId).subscribe({
        next: res => {
          // Kiểm tra phản hồi từ máy chủ để kiểm tra việc xóa thành công (code === 200)
          if (res.code === 200) {
            // Nếu xóa nhân viên thành công, hiển thị thông báo thành công.
            const message = "ユーザの削除が完了しました。";
            this.router.navigate(['messageAdd'], { state: { messageInf: message } });
            console.log("Errr: ", res);
          } else {
            // Nếu mã phản hồi không phải 200, xử lý trường hợp lỗi.
            this.isForm = false;
            this.errorMes = res.message.params;
            console.log("Test: ", this.errorMes);
            
          }
        }
      });
    }
  }
}
