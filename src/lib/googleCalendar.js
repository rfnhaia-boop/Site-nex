import { google } from 'googleapis';

const TIMEZONE = 'America/Sao_Paulo';
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;
const SLOT_MINUTES = 30;

function getClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Credenciais do Google Calendar não configuradas no .env.local.');
  }
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

function getCalendarId() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID não configurado no .env.local.');
  return calendarId;
}

// Gera os horários comerciais (9h-18h, seg-sex, blocos de 30min) dos próximos `businessDaysAhead` dias úteis,
// exclui o que já está ocupado no Google Calendar, e devolve os primeiros `limit` que ainda estão no futuro.
export async function getAvailableSlots({ businessDaysAhead = 5, limit = 8 } = {}) {
  const calendar = getClient();
  const calendarId = getCalendarId();

  const now = new Date();
  const rangeStart = new Date(now);
  const rangeEnd = new Date(now);
  rangeEnd.setDate(rangeEnd.getDate() + businessDaysAhead + 4); // folga pra cobrir fins de semana

  const { data } = await calendar.events.list({
    calendarId,
    timeMin: rangeStart.toISOString(),
    timeMax: rangeEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
  });

  const busyRanges = (data.items || [])
    .filter((event) => event.start?.dateTime && event.end?.dateTime)
    .map((event) => ({ start: new Date(event.start.dateTime), end: new Date(event.end.dateTime) }));

  function isSlotBusy(slotStart, slotEnd) {
    return busyRanges.some((busy) => slotStart < busy.end && slotEnd > busy.start);
  }

  const slots = [];
  let daysChecked = 0;
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);

  while (daysChecked < businessDaysAhead + 4 && slots.length < limit) {
    const dayOfWeek = cursor.getDay(); // 0 = domingo, 6 = sábado
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour += SLOT_MINUTES / 60) {
        const slotStart = new Date(cursor);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60000);

        if (slotStart > now && !isSlotBusy(slotStart, slotEnd)) {
          slots.push({
            iso: slotStart.toISOString(),
            label: slotStart.toLocaleString('pt-BR', {
              timeZone: TIMEZONE,
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        }
        if (slots.length >= limit) break;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
    daysChecked += 1;
  }

  return slots;
}

// Cria o evento real na agenda. Lança erro se o horário já não estiver mais livre (checagem de corrida).
export async function createBookingEvent({ nome, contato, resumo, startIso }) {
  const calendar = getClient();
  const calendarId = getCalendarId();

  const start = new Date(startIso);
  const end = new Date(start.getTime() + SLOT_MINUTES * 60000);

  const { data: existing } = await calendar.events.list({
    calendarId,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
  });
  if ((existing.items || []).length > 0) {
    const err = new Error('Esse horário acabou de ser ocupado. Escolha outro.');
    err.code = 'SLOT_TAKEN';
    throw err;
  }

  const { data } = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `NEX — Conversa com ${nome}`,
      description: [
        `Agendado pelo site da NEX (/links).`,
        `Contato: ${contato || 'não informado'}`,
        resumo ? `Resumo: ${resumo}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
    },
  });

  return { eventId: data.id, htmlLink: data.htmlLink, start: start.toISOString() };
}
