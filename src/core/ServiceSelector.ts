import { AbsenceService } from "../services/absence.service";
import { AuthService } from "../services/auth.service";
import { ModalService } from "../services/modal.service";
import { StudentService } from "../services/student.service";

class ServiceSelector {
  public readonly absenceService: AbsenceService;
  public readonly authService: AuthService;
  public readonly modalService: ModalService;
  public readonly studentService: StudentService;

  constructor() {
    this.absenceService = new AbsenceService();
    this.authService = new AuthService();
    this.modalService = new ModalService();
    this.studentService = new StudentService();
  }
}

export default new ServiceSelector();
