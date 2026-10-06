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
  absences: {
    id: number;
    absenceDate: Date;
    reasonStd: {
      id: number;
      name: string;
      description: string;
    };
    reasonDetail: string;
    justified: boolean;
    returnDate: Date;
    alerts: [
      {
        id: number;
        absenceId: number;
        alertSentTypeId: number;
        alertSentAt: Date;
        contactDetails: string;
        message: string;
        status: boolean;
        errorMessage: string;
        alertSentType: {
          id: number;
          name: string;
        };
      },
    ];
  }[];
}
