import { useEffect, useState } from "react";
import type { AbsenceAttributes } from "../../models/interfaces";
import ServiceSelector from "../../core/ServiceSelector";
import "./home.page.scss";
import { useAuth } from "../../hooks/useAuth";

function HomePage() {
  const [absences, setAbsences] = useState<AbsenceAttributes[]>();

  useAuth();

  useEffect(() => {
    ServiceSelector.absenceService
      .getOnGoingAbsences()
      .then(setAbsences)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto home-page">
      <h2 className="welcome">Bonjour</h2>
    </div>
  );
}

export default HomePage;
