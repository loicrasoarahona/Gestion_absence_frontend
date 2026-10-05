import type { AbsenceAttributes } from "../../../models/interfaces";
import AbsenceRow from "./absence-row";

interface AbsenceGroupSectionProps {
  title: string;
  absences: AbsenceAttributes[];
  onOpenSendAlert: (absenceId: number) => void;
}

function AbsenceGroupSection({
  title,
  absences,
  onOpenSendAlert,
}: AbsenceGroupSectionProps) {
  if (absences.length === 0) return null;

  return (
    <section className="mb-8">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
        {title}
      </h3>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Date</th>
              <th>Alerté</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {absences.map((absence) => (
              <AbsenceRow
                key={
                  absence.id ?? `${absence.studentId}-${absence.absenceDate}`
                }
                absence={absence}
                onOpenSendAlert={onOpenSendAlert}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AbsenceGroupSection;
