import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Department } from 'src/app/model/department';
import { CertificationService } from 'src/app/service/certification.service';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { ValidateComponent } from '../../valid/validate/validate.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public bsConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();

  employeeId: any;

  listDepartment: Department[] = [];
  listCertification !: any[];

  // Group data
  data !: FormGroup;

  //Check message error
  isErrorMessage = false;

  //Check id certification
  hadCertification = false;

  //check xem còn valid khi submit sang màn confirm
  isSubmit =false;

  // message error
  errorMessage = '';

  disEmployeeLoginId = false;

  @ViewChild('employeeName') employeeName: ElementRef | undefined;
  @ViewChild('employeeLoginId') employeeLoginId: ElementRef | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private employeeService: EmployeeService) {
    this.bsConfig = {
      dateInputFormat: 'YYYY/MM/DD'
    }
    // tạo form group
    this.data = this.fb.group({
      employeeId: [''],
      employeeLoginId: ['', [ValidateComponent.ValidEmployeeLoginId]],
      departmentId: ['', [ValidateComponent.ValidDepartment]],
      employeeName: ['', [ValidateComponent.ValidEmployeeName]],
      employeeNameKana: ['', [ValidateComponent.ValidEmployeeNameKana]],
      employeeBirthDate: ['', [ValidateComponent.ValidEmployeeBirthDate]],
      employeeEmail: ['', [ValidateComponent.ValidEmployeeEmail]],
      employeeTelephone: ['', [ValidateComponent.ValidEmployeeTelePhone]],
      employeeLoginPassword: ['', [ValidateComponent.ValidLoginPassword]],
      employeeLoginPasswordConfirm: ['', [ValidateComponent.ValidLoginPasswordConfirm]],
      certifications: this.fb.group({
        certificationId: [''],
        certificationStartDate: [''],
        certificationEndDate: [''],
        employeeCertificationScore: ['']
      },
        {
          validators: ValidateComponent.certificateDateValidator,
        })
    }, {
      validator: ValidateComponent.ConfirmPassword,
    })
  }
  ngOnInit() {
    this.errorMessage = history.state.errorMessage;
    this.getListCertification();
    this.getListDepartment();
    this.assignValue();
  }

  // Lấy danh sách department
  getListDepartment(): void {
    this.departmentService.getAllDepartment().subscribe(
      (data: any) => {
        this.listDepartment = data.department;
      }
    );
  }

  // Lấy ra danh sách certification
  getListCertification(): void {
    this.certificationService.getAllCertification().subscribe(
      (data: any) => {
        this.listCertification = data.certification;
      }
    );
  }
  markControlDirtyTouched(formGroup : FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if(control instanceof FormGroup) {
        this.markControlDirtyTouched(control);
      } else {
        // control.markAsDirty();
        control.markAllAsTouched();
      }
    })
  }
  //biding dữ liệu sang màn confirm
  directionConfirm() {
    if (this.data.valid) {
      const departmentId = this.data.value.departmentId;
      const department = this.listDepartment.find(d => d.departmentId == departmentId);
      const certificationId = this.data.value.certifications.certificationId;
      const certification = this.listCertification.find(c => c.certificationId == certificationId);
      let getData = { employeeForm: this.data.value, department: department, certification: certification }
      this.router.navigate(['/user/confirm'], { state: { getData } });
    }
    else {
      this.markControlDirtyTouched(this.data);
    }
  }

  // Gán dữ liệu vào màn hình
  assignValue() {
    const dEmployeeId = history.state.employeeId;
    const patchValue = history.state.data;
    // check certificationId
    const certificationId = patchValue?.certifications?.certificationId;
    // Kiểm tra xem id có tồn tại hay không
    if (dEmployeeId) {
      // Kiểm tra xem có dữ liệu từ patchValue không
      if (patchValue) {
        this.disEmployeeLoginId = true;
        this.data.patchValue(history.state.data);
        const password = this.data.get('employeeLoginPassword');
        const passwordConfirm = this.data.get('employeeLoginPasswordConfirm');
        if (password?.value == '') {
          password?.clearValidators();
          passwordConfirm?.clearValidators();
        } else {
          password?.setValidators([ValidateComponent.ValidLoginPassword]);
          passwordConfirm?.setValidators([ValidateComponent.ValidLoginPasswordConfirm]);
        }
        password?.updateValueAndValidity();
        passwordConfirm?.updateValueAndValidity();
        if (certificationId) {
          this.hadCertification = true;
        }
      }
      else {
        this.disEmployeeLoginId = true;
        this.data.patchValue(history.state.data);
        const password = this.data.get('employeeLoginPassword');
        const passwordConfirm = this.data.get('employeeLoginPasswordConfirm');
        if (password?.value == '') {
          password?.clearValidators();
          passwordConfirm?.clearValidators();
        } else {
          password?.setValidators([ValidateComponent.ValidLoginPassword]);
          passwordConfirm?.setValidators([ValidateComponent.ValidLoginPasswordConfirm]);
        }
        password?.updateValueAndValidity();
        passwordConfirm?.updateValueAndValidity();
        this.getEmployeeById(dEmployeeId);
      }
    } else {
        if (certificationId) {
          this.hadCertification = true;
        }
        this.data.patchValue(patchValue);
    }
  }

  // xử lý validate certification
  onCertificationChange() {
    const certificationId = this.data.value?.certifications?.certificationId;
    const certification = this.data.get('certifications');
    if (certificationId) {
      this.hadCertification = true;
      certification?.get('certificationStartDate')?.setValidators([ValidateComponent.ValidEmployeeBirthDate]);
      certification?.get('certificationEndDate')?.setValidators([ValidateComponent.ValidEmployeeBirthDate]);
      certification?.get('employeeCertificationScore')?.setValidators(ValidateComponent.ValidScore);
    } else {
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
  getEmployeeById(employeeId: any) {
    this.employeeService.getEmployeeById(employeeId).subscribe(
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
 
  cancel() {
    const checkEmployeeId = this.data.get('employeeId')?.value;
    if(checkEmployeeId != '' ) {
      this.router.navigate(['/detail'], {state : {employeeId : checkEmployeeId }})
    } else {
      this.router.navigate(['/user/list']);
    }
    
  }

  ngAfterViewInit() {
    const id = history.state.employeeId; // Lấy giá trị của tham số 'id' từ route
    if (id) {
      // Focus vào hạng mục employeeName nếu có id trong route
      if (this.employeeName) {
        this.employeeName.nativeElement.focus();
      }
    } else {
      // Focus vào hạng mục employeeLoginId nếu không có id trong route
      if (this.employeeLoginId) {
        this.employeeLoginId.nativeElement.focus();
      }
    }
  }

}
