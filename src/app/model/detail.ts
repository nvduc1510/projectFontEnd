import { EmployeeCertification } from './detailEmployeeCertificaiton';
/**
 * Đại diện cho chi tiết thông tin của một nhân viên.
 */
export interface Detail {
    employeeId: number;
    employeeName: string;
    employeeBirthDate: Date;
    departmentId: string;
    departmentName: string;
    employeeEmail: string;
    employeeTelephone: string;
    employeeNameKana: string;
    employeeLoginId: string;
    certifications: EmployeeCertification[];
}