import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Department } from 'src/app/model/department';
import { CertificationService } from 'src/app/service/certification.service';
import { DepartmentService } from 'src/app/service/department.service';
import { ShareDateService } from 'src/app/service/share-date.service';
import { CustomValidatorComponent } from './../../valid/custom-validator/custom-validator.component';
import { EmployeeService } from 'src/app/service/employee.service';
import { Detail } from 'src/app/model/detail';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent  implements OnInit{
  listDepartment : Department[] = [];
  listCertification !: any  [];
  data !: FormGroup;
  isErrorMessage = false;
  hadCertification: boolean = false;
  isSubmit = false;

  public bsConfig: Partial <BsDatepickerConfig>;
  bsValue = new Date();

  submitted = false;
  hasError = false;

  employeeFormValue: any;
  errorMessage!: string;
  certification: any;

  employeeId : any;
  disEmployeeName = false;

  constructor(
    private route : Router,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private employeeService : EmployeeService) {
      this.bsConfig = {
        dateInputFormat: 'YYYY/MM/DD'
      }
  }

  ngOnInit() {
    this.errorMessage = history.state.errorMessage;
    // tạo form group
    this.data = this.fb.group ({
      employeeId:[''],
      employeeLoginId : ['', [CustomValidatorComponent.ValidEmployeeLoginId]],
      departmentId : ['', [CustomValidatorComponent.ValidDepartment]],
      employeeName : ['', [CustomValidatorComponent.ValidEmployeeName]],
      employeeNameKana : ['', [CustomValidatorComponent.ValidEmployeeNameKana]],
      employeeBirthDate : ['', [CustomValidatorComponent.ValidEmployeeBirthDate]],
      employeeEmail : ['', [CustomValidatorComponent.ValidEmployeeEmail]],
      employeeTelephone : ['', [CustomValidatorComponent.ValidEmployeeTelePhone]],
      employeeLoginPassword : ['', [CustomValidatorComponent.ValidLoginPassword]],
      employeeLoginPasswordConfirm : ['', [CustomValidatorComponent.ValidLoginPasswordConfirm]],
      certifications : this.fb.group({
        certificationId : [''],
        certificationStartDate : [''],
        certificationEndDate : [''],
        employeeCertificationScore : ['', CustomValidatorComponent.ValidaScore]
      },
      {
        validators: CustomValidatorComponent.certificateDateValidator,
      })
    },{
      validator : CustomValidatorComponent.ConfirmPassword,
    })
    
    this.getListCertification();
    this.getListDepartment();
    this.patchValue();
    
    // check xem đường truyền có tồn tại id hay không
    const stateEmployeeId = history.state.employeeId;
    if (stateEmployeeId) {
      this.employeeId = stateEmployeeId;
      this.disEmployeeName = true;
      const employeeLoginPassword = this.data.get('employeeLoginPassword');
      const employeeLoginPasswordConfirm = this.data.get('employeeLoginPasswordConfirm');
      if( this.data.get('employeeLoginPassword')?.value == '') {
        this.data.get('employeeLoginPassword')?.clearValidators();
        this.data.get('employeeLoginPasswordConfirm')?.clearValidators();
      } else {
        employeeLoginPassword?.setValidators([CustomValidatorComponent.ValidLoginPassword]);
        employeeLoginPasswordConfirm?.setValidators([CustomValidatorComponent.ValidLoginPasswordConfirm]);
      }
      employeeLoginPassword?.updateValueAndValidity();
      employeeLoginPasswordConfirm?.updateValueAndValidity();
      this.getEmployeeById(this.employeeId);
    }

  }

  // Lấy danh sách department
  getListDepartment(): void {
    this.departmentService.getListDepartment().subscribe(
      (data: any) => {
        this.listDepartment = data.department;
      }
    );
  }

  // Lấy ra danh sách certification
  getListCertification(): void {
    this.certificationService.getAllCertification().subscribe(
      (data: any) => {
        this.listCertification = data.department;
      }
    );
  }

  //biding dữ liệu sang màn confirm
  directionConfirm() {
    if(this.data.valid){
      this.isSubmit = false;
      const departmentId = this.data.value.departmentId;
      const department = this.listDepartment.find(d => d.departmentId == departmentId);
      const certificationId = this.data.value.certifications.certificationId;
      const certification = this.listCertification.find(c => c.certificationId == certificationId);
      let getData = {employeeForm : this.data.value, department: department, certification : certification}
      this.route.navigate(['/user/confirm'], { state: {getData}});
    }
    else {
      this.isSubmit = true;
    }
  }
  // Gán dữ liệu từ màn confirm back 
  patchValue() {
    const patchValue= history.state.data;
    const certificationId = patchValue?.certifications?.certificationId;
    if(certificationId){
        this.hadCertification = true;
    }
    this.data.patchValue(history.state.data);
  }

  // xử lý validate certification
  onCertificationChange() {
    const certificationId = this.data.value?.certifications?.certificationId;
    const certification = this.data.get('certifications');
    if(certificationId){
      this.hadCertification = true;
      certification?.get('certificationStartDate')?.setValidators([CustomValidatorComponent.ValidEmployeeBirthDate]);
      certification?.get('certificationEndDate')?.setValidators([CustomValidatorComponent.ValidEmployeeBirthDate]);
      certification?.get('employeeCertificationScore')?.setValidators(CustomValidatorComponent.ValidScore);
    }else{
      this.hadCertification = false;
      // clear validators khi certification null
      certification?.get('certificationStartDate')?.clearValidators();
      certification?.get('certificationEndDate')?.clearValidators();
      certification?.get('employeeCertificationScore')?.clearValidators();
      //Reset lại dữ liệu khi certification null
      certification?.get('certificationStartDate')?.reset();
      certification?.get('certificationEndDate')?.reset();
      certification?.get('employeeCertificationScore')?.reset();
    }
    certification?.get('certificationStartDate')?.updateValueAndValidity();
    certification?.get('certificationEndDate')?.updateValueAndValidity();
    certification?.get('employeeCertificationScore')?.updateValueAndValidity();
  }
  // lấy employee qua id
  getEmployeeById(employeeId : any) {
    this.employeeService.getEmployeeById(employeeId).subscribe (
      (response) => {
        console.log(response);
        this.data.patchValue(response);
        if (response.certifications[0].certificationName == null) {
          this.data.patchValue({
            certificationId: "",
            certificationStartDate: null,
            certificationEndDate: null,
            employeeCertificationScore: null
          });
        } else {
          this.data.controls['certifications'].patchValue(response.certifications[0])
          this.hadCertification = true;
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
}
