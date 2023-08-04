/**
 * Đại diện cho chi tiết chứng chỉ của một nhân viên.
 */
export interface DetailEmployeeCertification {
    certificationId: number;
    certificationName: string;
    startDate: Date;
    endDate: Date;
    score: number;
}