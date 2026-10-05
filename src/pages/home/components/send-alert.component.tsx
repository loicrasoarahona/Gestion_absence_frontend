import { useEffect, useState } from "react";
import ServiceSelector from "../../../core/ServiceSelector";
import type {
  AlertSentAttributes,
  AlertSentType,
} from "../../../models/interfaces";
import { formatAbsenceSince } from "../../../utils/absence.utils";
import DOMPurify from "dompurify";

interface Props {
  absenceId: number | null;
}

const ALERT_TABS: { type: AlertSentType; label: string; icon: string }[] = [
  { type: "email", label: "Email", icon: "bi-envelope" },
  { type: "phone", label: "Téléphone", icon: "bi-telephone" },
];

const SendAlertComponent: React.FC<Props> = ({ absenceId }) => {
  const [alertType, setAlertType] = useState<AlertSentType>("phone");
  const [result, setResult] = useState<{
    key: string;
    message: string;
    lastAlertSent: AlertSentAttributes | null;
  }>();

  const requestKey = absenceId != null ? `${absenceId}-${alertType}` : null;
  const isLoading = requestKey != null && result?.key !== requestKey;
  const messageBody = result?.key === requestKey ? result.message : undefined;
  const lastAlertSent =
    result?.key === requestKey ? result.lastAlertSent : undefined;

  useEffect(() => {
    if (absenceId == null) return;

    const key = `${absenceId}-${alertType}`;
    let ignore = false;

    Promise.all([
      ServiceSelector.absenceService.getMessageModel(absenceId, alertType),
      ServiceSelector.absenceService.getLastAlertSent(absenceId, alertType),
    ])
      .then(([messageRes, lastAlertSent]) => {
        if (!ignore) {
          setResult({ key, message: messageRes.message, lastAlertSent });
        }
      })
      .catch((err) => console.error(err));

    return () => {
      ignore = true;
    };
  }, [absenceId, alertType]);

  return (
    <div>
      {/* Dernière alerte envoyée */}
      {lastAlertSent && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i
              className={`bi ${
                lastAlertSent.status === "success"
                  ? "bi-check-circle-fill text-success-700"
                  : "bi-exclamation-circle-fill text-danger-600"
              }`}
            ></i>
            <span>
              Dernière alerte par{" "}
              <span className="font-medium text-slate-800">
                {ALERT_TABS.find((tab) => tab.type === alertType)?.label ??
                  alertType}
              </span>{" "}
              · {formatAbsenceSince(lastAlertSent.alertSentAt)}
            </span>
          </div>
          <span
            className={
              lastAlertSent.status === "success"
                ? "badge-success"
                : "badge-muted"
            }
          >
            {lastAlertSent.status === "success" ? "Envoyée" : "Échec"}
          </span>
        </div>
      )}

      {/* Méthode d'envoi */}
      <div>
        <div className="col-form-label">Méthode d'envoi</div>
        <div
          role="tablist"
          aria-label="Méthode d'envoi"
          className="inline-flex gap-1 rounded-lg bg-slate-100 p-1"
        >
          {ALERT_TABS.map(({ type, label, icon }) => {
            const isActive = alertType === type;
            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setAlertType(type)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className={`bi ${icon}`}></i>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Le corps du message */}
      <div className="mt-4">
        <div className="col-form-label">Aperçu du message</div>

        {isLoading && (
          <div className="animate-pulse space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="h-3 w-5/6 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-2/3 rounded bg-slate-200" />
          </div>
        )}

        {!isLoading && messageBody != undefined && (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(messageBody),
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
          ></div>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-3">
        <button className="btn-primary" disabled={isLoading}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default SendAlertComponent;
