export interface AbsenceAttributes {
  id?: number;
  absenceDate: Date;
  studentId: number;
  studentName: string;
  studentSurname: string;
  studentClass: string;
  reasonStdId?: number | null;
  reasonDetail?: string | null;
  reasonStd?: AbsenceReasonStdAttributes;
  absenceReturnId?: number | null;
  return?: AbsenceReturnAttributes;
  alerts?: AlertSentAttributes[];
}

export interface AbsenceReturnAttributes {
  id?: number;
  absenceId: number;
  returnDate: Date;
  absence?: AbsenceAttributes;
}

export interface AbsenceReasonStdAttributes {
  id?: number;
  name: string;
  description?: string | null;
  absences?: AbsenceAttributes[];
}

export interface AlertSentTypeAttributes {
  id?: number;
  name: string;
  alerts?: AlertSentAttributes[];
}

export type AlertSentStatus = "success" | "failed";

export interface AlertSentAttributes {
  id?: number;
  absenceId: number;
  alertSentTypeId: number;
  alertSentAt: Date;
  contactDetails: string;
  message: string;
  status: AlertSentStatus;
  errorMessage?: string | null;
  absence?: AbsenceAttributes;
  alertSentType?: AlertSentTypeAttributes;
}

export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  surname: string;
  roles: {
    name: string;
  }[];
}

export interface ClassLevelAttributes {
  id: number;
  name: string;
}

export class StudentAttributes {
  id?: number;
  name?: string;
  surname?: string;
  classLevelId?: number;
  address?: number;
  parents?: ParentAttributes[];
}

export class ParentAttributes {
  id?: number;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
}

const AlertSentType = {
  PHONE: "phone",
  EMAIL: "email",
} as const;

export type AlertSentType = (typeof AlertSentType)[keyof typeof AlertSentType];
