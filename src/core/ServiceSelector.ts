import { AbsenceService } from "../services/absence.service";
import { AuthService } from "../services/auth.service";

class ServiceSelector {
  public readonly absenceService: AbsenceService;
  public readonly authService: AuthService;

  constructor() {
    this.absenceService = new AbsenceService();
    this.authService = new AuthService();
  }
}

export default new ServiceSelector();
