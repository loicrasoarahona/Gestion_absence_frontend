import type { AlertSentAttributes } from "../models/interfaces";

export type AbsenceGroupKey = "today" | "yesterday" | "week" | "older";

export const ABSENCE_GROUPS: { key: AbsenceGroupKey; label: string }[] = [
  { key: "today", label: "Aujourd'hui" },
  { key: "yesterday", label: "Hier" },
  { key: "week", label: "Cette semaine" },
  { key: "older", label: "Il y a longtemps" },
];

export function getAbsenceGroup(date: Date): AbsenceGroupKey {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (date >= startOfToday) return "today";
  if (date >= startOfYesterday) return "yesterday";
  if (date >= startOfWeek) return "week";
  return "older";
}

export function formatAbsenceSince(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    const diffMinutes = Math.max(
      0,
      Math.floor((now.getTime() - date.getTime()) / 60000),
    );
    if (diffMinutes < 1) return "Absent depuis moins d'une minute";
    if (diffMinutes < 60) {
      return `Absent depuis ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    return `Absent depuis ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
  }

  const day = date.getDate();
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const time =
    date.getMinutes() === 0
      ? `${date.getHours()}h`
      : `${date.getHours()}h${date.getMinutes().toString().padStart(2, "0")}`;
  return `Absent le ${day} ${month} à ${time}`;
}

export function getAlertStatus(alerts?: AlertSentAttributes[]): {
  label: string;
  sent: boolean;
} {
  if (!alerts || alerts.length === 0) {
    return { label: "Non alerté", sent: false };
  }

  const successfulTypes = Array.from(
    new Set(
      alerts
        .filter((alert) => alert.status === "success" && alert.alertSentType)
        .map((alert) => alert.alertSentType!.name),
    ),
  );

  if (successfulTypes.length === 0) {
    return { label: "Alerte échouée", sent: false };
  }

  return { label: successfulTypes.join(" / "), sent: true };
}
