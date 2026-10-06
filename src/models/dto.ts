import type { AbsenceAttributes } from "./interfaces";

export class createAbsenceDto {
  absenceDate?: Date;
  studentId!: number;
  studentName!: string;
  studentSurname!: string;
  studentClass!: string;
}

export interface StudentAttendanceReportDto {
  student: {
    id: 1;
    name: string;
    surname: string;
  };
  period: {
    from: Date;
    to: Date;
  };
  totalAbsences: number;
  justifiedCount: number;
  unjustifiedCount: number;
  absences: AbsenceAttributes[];
}
