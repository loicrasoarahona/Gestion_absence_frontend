import { AbsenceService } from "../services/absence.service";
import { AuthService } from "../services/auth.service";
import { ModalService } from "../services/modal.service";

class ServiceSelector {
  public readonly absenceService: AbsenceService;
  public readonly authService: AuthService;
  public readonly modalService: ModalService;

  constructor() {
    this.absenceService = new AbsenceService();
    this.authService = new AuthService();
    this.modalService = new ModalService();
  }
}

export default new ServiceSelector();
