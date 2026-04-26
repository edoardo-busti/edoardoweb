import { google } from "googleapis";
import { readFileSync } from "fs";
import { join } from "path";

// Carica le credenziali del service account
// In produzione usa la variabile d'ambiente, in locale il file JSON
const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
  : JSON.parse(
      readFileSync(join(process.cwd(), "lib/service-account.json"), "utf-8"),
    );

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

/**
 * Restituisce gli eventi del calendario per un giorno specifico.
 * Usato per capire quali slot sono già occupati.
 */
export async function getBusySlots(dateStr) {
  const startOfDay = new Date(`${dateStr}T00:00:00`);
  const endOfDay = new Date(`${dateStr}T23:59:59`);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
    },
  });

  const busy = res.data.calendars[process.env.GOOGLE_CALENDAR_ID].busy;
  return busy; // array di { start, end }
}

/**
 * Crea un evento sul calendario con Google Meet.
 */
export async function createCalendarEvent({ date, slot, name, email, type }) {
  const start = new Date(`${date}T${slot}:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 minuti

  const event = {
    summary: `Call con ${name}`,
    description:
      type === "meet"
        ? `Call Google Meet prenotata tramite sito.`
        : `Chiamata telefonica prenotata tramite sito.`,
    start: {
      dateTime: start.toISOString(),
      timeZone: "Europe/Rome",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Europe/Rome",
    },
    attendees: [{ email }],
    ...(type === "meet" && {
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  };

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: event,
    conferenceDataVersion: type === "meet" ? 1 : 0,
    sendUpdates: "none",
  });

  const meetLink =
    res.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri ?? null;

  return { eventId: res.data.id, meetLink };
}
