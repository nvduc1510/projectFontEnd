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
  employeeId: any;
  employeeAdd !:any;

  certification: any;

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
    this.employeeService.getEmployeeById(this.employeeId).subscribe(
      (data) => {
        this.employee = data;
        this.certification = this.employee?.certifications;
        // Lưu thông tin nhân viên vào sessionStorage
        // sessionStorage.setItem('employee', JSON.stringify(this.employee));
      },
      (error) => {
        console.error(error);
      }
    );
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
          // Kiểm tra phản hồi từ máy chủ để kiểm tra việc xóa thành công (code === 200)
          if (res.code === 200) {
            const message = "ユーザの削除が完了しました。";
            this.router.navigate(['messageAdd'], { state: { messageInf: message } });
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
  directionData(employeeId: any) {
    this.router.navigate(['/user/add'], { state: { employeeId } });
    console.log("EmployeeId: ", employeeId);
  }
}