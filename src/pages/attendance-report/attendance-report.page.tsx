import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import ServiceSelector from "../../core/ServiceSelector";
import type { StudentAttendanceReportDto } from "../../models/dto";
import { dateFormatStd } from "../../utils/date.utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./attendance-report.page.scss";

type ReportAbsence = StudentAttendanceReportDto["absences"][number];
type ReportAlert = ReportAbsence["alerts"][number];

function defaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return dateFormatStd(date);
}

function formatDate(dateInput: Date | string) {
  return new Date(dateInput).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAlertStatus(alerts: ReportAlert[] | undefined): {
  label: string;
  sent: boolean;
} {
  if (!alerts || alerts.length === 0) {
    return { label: "Non alerté", sent: false };
  }

  const successfulTypes = Array.from(
    new Set(
      alerts.filter((alert) => alert.status).map((alert) => alert.alertSentType.name),
    ),
  );

  if (successfulTypes.length === 0) {
    return { label: "Alerte échouée", sent: false };
  }

  return { label: successfulTypes.join(" / "), sent: true };
}

function AttendanceReportPage() {
  useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const [from, setFrom] = useState(defaultFromDate);
  const [to, setTo] = useState(() => dateFormatStd(new Date()));
  const [reportResult, setReportResult] = useState<{
    key: string;
    report: StudentAttendanceReportDto;
  }>();
  const [error, setError] = useState<string | null>(null);

  const requestKey = `${studentId}-${from}-${to}`;
  const report =
    reportResult?.key === requestKey ? reportResult.report : undefined;

  useEffect(() => {
    if (!studentId || !from || !to) return;

    let ignore = false;
    const key = `${studentId}-${from}-${to}`;

    ServiceSelector.studentService
      .getAttendanceReport(studentId, from, to)
      .then((result) => {
        if (ignore) return;
        setReportResult({ key, report: result });
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setError("Impossible de charger le rapport d'absences.");
      });

    return () => {
      ignore = true;
    };
  }, [studentId, from, to]);

  function handleExportPdf() {
    if (!report) return;

    const doc = new jsPDF();
    const studentName = `${report.student.name} ${report.student.surname}`;

    doc.setFontSize(16);
    doc.text("Rapport d'absences", 14, 18);
    doc.setFontSize(11);
    doc.text(`Élève : ${studentName}`, 14, 27);
    doc.text(
      `Période : du ${formatDate(report.period.from)} au ${formatDate(report.period.to)}`,
      14,
      34,
    );
    doc.text(
      `Total : ${report.totalAbsences} · Justifiées : ${report.justifiedCount} · Non justifiées : ${report.unjustifiedCount}`,
      14,
      41,
    );

    autoTable(doc, {
      startY: 48,
      head: [["Date", "Motif", "Justifiée", "Retour", "Alerte"]],
      body: report.absences.map((absence) => {
        const alertStatus = getAlertStatus(absence.alerts);
        return [
          formatDate(absence.absenceDate),
          absence.reasonStd?.description || absence.reasonDetail || "—",
          absence.justified ? "Oui" : "Non",
          absence.returnDate ? formatDate(absence.returnDate) : "En cours",
          alertStatus.label,
        ];
      }),
    });

    doc.save(`rapport-absences-${studentName}-${from}-au-${to}.pdf`);
  }

  return (
    <div className="attendance-report-page container mx-auto my-5">
      <button type="button" onClick={() => navigate(-1)} className="btn mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Retour
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">
          Rapport d'absences
          {report && ` · ${report.student.name} ${report.student.surname}`}
        </h2>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleExportPdf}
          disabled={!report}
        >
          <i className="bi bi-file-earmark-pdf"></i>
          Exporter en PDF
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mt-4 mb-6">
        <div className="form-group">
          <label className="col-form-label">Du :</label>
          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="col-form-label">Au :</label>
          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2.5 text-sm text-danger-700">
          {error}
        </div>
      )}

      {!report && !error && (
        <p className="text-slate-500">Chargement du rapport...</p>
      )}

      {report && (
        <>
          <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Absences
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">
                {report.totalAbsences}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Justifiées
              </p>
              <p className="mt-1 text-2xl font-semibold text-success-700">
                {report.justifiedCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Non justifiées
              </p>
              <p className="mt-1 text-2xl font-semibold text-danger-600">
                {report.unjustifiedCount}
              </p>
            </div>
          </div>

          {report.absences.length === 0 ? (
            <p className="text-slate-500">Aucune absence sur cette période.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Motif</th>
                    <th>Justifiée</th>
                    <th>Retour</th>
                    <th>Alerte</th>
                  </tr>
                </thead>
                <tbody>
                  {report.absences.map((absence) => {
                    const alertStatus = getAlertStatus(absence.alerts);
                    return (
                      <tr key={absence.id}>
                        <td className="whitespace-nowrap text-sm text-slate-600">
                          {formatDate(absence.absenceDate)}
                        </td>
                        <td className="text-sm text-slate-600">
                          {absence.reasonStd?.description ||
                            absence.reasonDetail ||
                            "—"}
                        </td>
                        <td>
                          <span
                            className={
                              absence.justified
                                ? "badge-success"
                                : "badge-muted"
                            }
                          >
                            {absence.justified ? "Oui" : "Non"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap text-sm text-slate-600">
                          {absence.returnDate
                            ? formatDate(absence.returnDate)
                            : "En cours"}
                        </td>
                        <td>
                          <span
                            className={
                              alertStatus.sent
                                ? "badge-success"
                                : "badge-muted"
                            }
                          >
                            {alertStatus.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceReportPage;
