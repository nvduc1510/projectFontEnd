import { ListEmployee } from "./listEmployee";

export interface Page {
    code : string;
    totalRecords : number;
    employees: ListEmployee[];
}