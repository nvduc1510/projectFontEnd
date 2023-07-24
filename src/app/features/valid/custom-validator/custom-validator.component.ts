import { Component } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-custom-validator',
  templateUrl: './custom-validator.component.html',
  styleUrls: ['./custom-validator.component.css']
})
export class CustomValidatorComponent {

  static ValidEmployeeLoginId( c : AbstractControl) : MessageComponent | null {
    const loginFormat =/^[a-zA-Z_][a-zA-Z0-9_]*$/;
    // const eHalfSize = /^[ -~]+$/;
    const loginId = c.value
    const d = ( c.touched ||c.dirty)
    if(!loginId) {
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(loginId.length > 50 && c.touched){
      return {
        code : 'ER006',
        params : 'xxxx桁以内の「画面項目名」を入力してください'
      }
    }
    if(!loginFormat.test(loginId) && d){
      return { code: 'ER008',
                params : '「画面項目名」に半角英数を入力してください'}
    }
    return null;
  }

  static ValidDepartment ( c : AbstractControl) : MessageComponent | null {
    const departmentId  = c.value
    if(!departmentId) {
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    return null;
  }

  static ValidEmployeeName ( c : AbstractControl) : MessageComponent | null {
    const employeeName  = c.value
    if(!employeeName) {
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }

    if(employeeName.length > 125){
      return {
        code : 'ER006',
        params : 'xxxx桁以内の「画面項目名」を入力してください'
      }
    }
    return null;
  }

  static ValidEmployeeNameKana (c : AbstractControl) : MessageComponent | null {
    const employeeNameKana = c.value
    const kanaHalfSize = /^[\u30A0-\u30FFー]+$/;
    if(!employeeNameKana){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(employeeNameKana.length > 125){
      return {
        code : 'ER006',
        params : 'xxxx桁以内の「画面項目名」を入力してください'
      }
    }
    if(!kanaHalfSize.test(employeeNameKana)){
      return { 
        code: 'ER009',
        params: '「画面項目名」をカタカナで入力してください'}
    }
    return null;
  }

  static ValidEmployeeBirthDate ( c : AbstractControl) : MessageComponent | null {
    const birthDate = c.value
    // const formDate = /^\d{4}\/\d{2}\/\d{2}$/
    if(!birthDate){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    // if(!formDate.test(birthDate)){
    //   return { 
    //     code: 'ER011',
    //     params: '「画面項目名」は無効になっています。[ER011]'
    //   }
    // }
    return null;
  }

  static ValidEmployeeTelePhone(c: AbstractControl) : MessageComponent | null {
    const employeeTelePhone = c.value
    const formTelePhone = /^[0-9]*$/;
    if(!employeeTelePhone){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(employeeTelePhone.length > 50){
      return {
        code : 'ER006',
        params : 'xxxx桁以内の「画面項目名」を入力してください'          
      }
    }
    return null;
  }

  static ValidEmployeeEmail( c : AbstractControl) : MessageComponent | null {
    const employeeEmail = c.value
    const formEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!employeeEmail){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(employeeEmail.length > 125){
      return {
        code : 'ER006',
        params : 'xxxx桁以内の「画面項目名」を入力してください'          
      }
    }
    if(!formEmail.test(employeeEmail)){
      return {
        code:'',
        params : 'Invalid email!'
      }
    }
    return null;
  }

  static ValidLoginPassword(c : AbstractControl) : MessageComponent | null {
    const loginPassword = c.value
    if (!loginPassword) {
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(loginPassword.length <=8 || loginPassword.length >= 50){
      return {
        code : 'ER007',
        params : '「画面項目名」を8＝桁数、＜＝50桁で入力してください [ER007]'
      }
    }
    return null;
  }

  static ValidLoginPasswordConfirm(c : AbstractControl) : MessageComponent | null {
    const loginPasswordConfirm = c.value
    if(loginPasswordConfirm.employeeLoginPassword === loginPasswordConfirm.employeeLoginPasswordConfirm){
      c.get('employeeLoginPasswordConfirm')?.setErrors(null); 
    }
    else{
      c.get('employeeLoginPasswordConfirm')?.setErrors({ passwordMismatch: true });
    }
    if(!loginPasswordConfirm){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(loginPasswordConfirm.length <= 8 || loginPasswordConfirm.length >= 50){
      return {
        code : 'ER007',
        params : '「画面項目名」を8＜＝桁数、＜＝50桁で入力してください [ER007]'
      }
    }
    return null; 
  }

  static ConfirmPassword( f : FormGroup) : MessageComponent | null {
    const v = f.value
    const passwordError = f.controls['employeeLoginPassword'].errors
    return v.employeeLoginPassword === v.employeeLoginPasswordConfirm || !!passwordError 
    ? null
    : {
      code : 'ER017',
      params : '「パスワード（確認」が不正です。[ER017]'

    };

    
  }

  static certificateDateValidator(group: AbstractControl): MessageComponent | null {
    const startDate = group.get('certificationStartDate')?.value;
    const endDate = group.get('certificationEndDate')?.value;
    
    

    if (!startDate || !endDate) {
      // If either start date or end date is null, no validation needed
      return null;
      
    }
    

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      // If either start date or end date is not a valid date, no validation needed
      
      return null;
    }

    if (endDateObj < startDateObj) {
      console.log("abc");
      return {
        code : 'ER012',
        params : '「「失効日」は「資格交付日」より未来の日で入力してください。[ER012]'
  
      };
    }

    return null;
  }

  // Validator
  static ValidScore(c : AbstractControl) : MessageComponent | null {
    const score = c.value
    const formScore  =/^[0-9]*$/
    if(!score){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    if(!formScore.test(score)){
      return {
        code : 'ER18',
        params : '「画面上の項目名」は半角で入力してください。',
      }
    }
    return null;
  }

  static ValidStartDate ( c : AbstractControl) : MessageComponent | null {
    const startDate = c.value
    if(!startDate){
      return {
        code : 'ER001',
        params : '画面項目名」を入力してください [ER001]'
      }
    }
    return null;
  }
}
