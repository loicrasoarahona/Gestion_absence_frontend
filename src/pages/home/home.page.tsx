import { useEffect, useMemo, useState } from "react";
import type { AbsenceAttributes } from "../../models/interfaces";
import ServiceSelector from "../../core/ServiceSelector";
import "./home.page.scss";
import { useAuth } from "../../hooks/useAuth";
import {
  ABSENCE_GROUPS,
  type AbsenceGroupKey,
  getAbsenceGroup,
} from "../../utils/absence.utils";
import AbsenceGroupSection from "./components/absence-group-section";

function HomePage() {
  const [absences, setAbsences] = useState<AbsenceAttributes[]>();
  const { user } = useAuth();

  useEffect(() => {
    ServiceSelector.absenceService
      .getOnGoingAbsences()
      .then(setAbsences)
      .catch((err) => console.error(err));
  }, []);

  const groupedAbsences = useMemo(() => {
    const groups: Record<AbsenceGroupKey, AbsenceAttributes[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };

    for (const absence of absences ?? []) {
      groups[getAbsenceGroup(new Date(absence.absenceDate))].push(absence);
    }

    for (const group of Object.values(groups)) {
      group.sort(
        (a, b) =>
          new Date(a.absenceDate).getTime() -
          new Date(b.absenceDate).getTime(),
      );
    }

    return groups;
  }, [absences]);

  return (
    <div className="w-full px-4 sm:px-6 py-8 home-page">
      <h2 className="welcome">Bonjour{user ? ` ${user.name}` : ""}</h2>
      <p className="text-slate-500 mt-1 mb-8">Absences en cours</p>

      {!absences && (
        <p className="text-slate-500">Chargement des absences...</p>
      )}

      {absences && absences.length === 0 && (
        <p className="text-slate-500">Aucune absence en cours.</p>
      )}

      {ABSENCE_GROUPS.map(({ key, label }) => (
        <AbsenceGroupSection
          key={key}
          title={label}
          absences={groupedAbsences[key]}
        />
      ))}
    </div>
  );
}

export default HomePage;
