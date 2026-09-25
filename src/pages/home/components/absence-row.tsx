import type { AbsenceAttributes } from "../../../models/interfaces";
import {
  formatAbsenceSince,
  getAlertStatus,
} from "../../../utils/absence.utils";

interface AbsenceRowProps {
  absence: AbsenceAttributes;
}

function AbsenceRow({ absence }: AbsenceRowProps) {
  const alertStatus = getAlertStatus(absence.alerts);

  return (
    <tr>
      <td>
        <p className="font-medium text-slate-800">
          {absence.studentName} {absence.studentSurname}
        </p>
        <p className="text-xs text-slate-400">{absence.studentClass}</p>
      </td>
      <td className="text-sm text-slate-600 whitespace-nowrap">
        {formatAbsenceSince(absence.absenceDate)}
      </td>
      <td>
        <span className={alertStatus.sent ? "badge-success" : "badge-muted"}>
          {alertStatus.label}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-end gap-2">
          <button type="button" className="btn-secondary">
            Alerter les parents
          </button>
          <button type="button" className="btn-primary">
            Confirmer le retour
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AbsenceRow;
