import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEmployeeDTO } from 'src/app/model/addEmployeeDTO';
import { EmployeeService } from 'src/app/service/employee.service';
import { ShareDateService } from 'src/app/service/share-date.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  addEmployee !: AddEmployeeDTO;
  data : any;
  public employeeForm:any;
  public department : any;
  public certification : any;
  public employeeCertification : any;

  constructor(
    private activatedRoute : ActivatedRoute,
    private route : Router,
    private employeeService : EmployeeService,
    private shareData : ShareDateService
  ) {}
  private formatDate(dateStr: string): string {
    if (dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
    return '';
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.data =JSON.parse(params['data']);
      this.department = this.data?.department;
      this.employeeForm = this.data?.employeeForm;
      this.employeeCertification = this.data?.employeeForm.certifications;
      this.certification = this.data?.certification;
    })
  }

  /**
   * Thực hiện back về màn add
   */
  cancel(){
    //Set dữ liệu vào setData trong ShareData
    this.shareData.setData(this.employeeForm);
    // Điều hướng về màn add
    this.route.navigate(['/user/add']);
  }

  // Xử lý dữ liệu từ form
  onSubmit() {
    const employeeData : AddEmployeeDTO = {
      departmentId: this.employeeForm.departmentId,
      departmentName: this.employeeForm.departmentName,
      employeeName: this.employeeForm.employeeName,
      employeeNameKana: this.employeeForm.employeeNameKana,
      employeeBirthDate: this.formatDate(this.employeeForm.employeeBirthDate),
      employeeEmail: this.employeeForm.employeeEmail,
      employeeTelephone: this.employeeForm.employeeTelephone,
      employeeLoginId: this.employeeForm.employeeLoginId,
      employeeLoginPassword: this.employeeForm.employeeLoginPassword,
      certifications:[]
    }
    const certification = this.employeeForm?.certifications;
    if(certification.certificationId){
      certification.certificationEndDate = this.formatDate(certification.certificationEndDate);
      certification.certificationStartDate = this.formatDate(certification.certificationStartDate);
      employeeData.certifications.push(certification);
    }
    this.employeeService.createEmployee(employeeData).subscribe({
      next: res => {
        console.log("success!");
        const message = "ユーザの登録が完了しました。";
        this.route.navigate(['messageAdd'], { state: { messageInf: message } }); 
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 500) {
          const message = '「アカウント名」は既に存在しています。'
          const employeeFormValue = this.shareData.setData(this.employeeForm);
          this.route.navigate(['/user/add'], { state: { employeeForm: employeeFormValue, errorMessage: message } });   
        }
      }
    });
  }
}
