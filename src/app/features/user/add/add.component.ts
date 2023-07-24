import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Department } from 'src/app/model/department';
import { CertificationService } from 'src/app/service/certification.service';
import { DepartmentService } from 'src/app/service/department.service';
import { ShareDateService } from 'src/app/service/share-date.service';
import { CustomValidatorComponent } from './../../valid/custom-validator/custom-validator.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  listDepartment : Department[] = [];
  listCertification !: any  [];
  data !: FormGroup;
  isErrorMessage = false;
  hadCertification: boolean = false;

  public bsConfig: Partial <BsDatepickerConfig>;
  bsValue = new Date();

  submitted = false;

  constructor(
    private http : HttpClient,
    private route : Router,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private shareData : ShareDateService ) {
      this.bsConfig = {
        dateInputFormat: 'YYYY/MM/DD'
      }
  }

  ngOnInit() {
    this.data = this.fb.group ({
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
        certificationStartDate : ['',],
        certificationEndDate : ['', ],
        employeeCertificationScore : ['',]
      },
      {
        validators: CustomValidatorComponent.certificateDateValidator,
      })
    },{
      validator : CustomValidatorComponent.ConfirmPassword,
      
    })
    
    this.getListCertification();
    this.getListDepartment();

    //Thực hiện lấy dữ liệu từ shareData
    const saveData = this.shareData.getData();
    const certificationId = saveData?.certifications?.certificationId;
    if(certificationId){
      this.hadCertification = true;
    }
    // Gán dữ liệu vào form
    this.data.patchValue(saveData); 
    console.log("save: ", saveData);
    console.log(' this.hadCertification: ',  this.hadCertification);
    
    
  }

  /**
   * Lấy danh sách department
   */
  getListDepartment() {
    this.departmentService.getListDepartment().subscribe (de => {
      this.listDepartment = de;
    })
  }

  /**
   * Lấy danh sách certification
   */
  getListCertification() {
    this.certificationService.getAllCertification().subscribe (cer => {
      this.listCertification = cer;
    })
  }

  /**
   * Thực hiện biding dữ liệu sang màn confirm
   */
  submit() {
    const departmentId = this.data.value.departmentId;
    const department = this.listDepartment.find(d => d.departmentId == departmentId);
    const certificationId = this.data.value.certifications.certificationId;
    const certification = this.listCertification.find(c => c.certificationId == certificationId);
    let getData = {employeeForm : this.data.value, department: department, certification : certification}
    const data = JSON.stringify(getData)
    const navigationExtras : NavigationExtras = {
      queryParams: {
        data :data
      }
    }
    this.route.navigate(['/user/confirm'], navigationExtras);
  }

  get f() {
    return this.data.controls;
  }

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
  
}
