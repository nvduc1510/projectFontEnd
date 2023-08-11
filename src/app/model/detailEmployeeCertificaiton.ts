/**
 * Đại diện cho chi tiết chứng chỉ của một nhân viên.
 */
export interface EmployeeCertification {
    certificationId: number;
    certificationName: string;
    certificationStartDate: string;
    certificationEndDate: string;
    employeeCertificationScore: number;
}