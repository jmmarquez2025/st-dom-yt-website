import { extractMassTimes, parseMassTime } from "./schedule";

const SCHEMA_DAY = {
  sunday: "https://schema.org/Sunday",
  sundayEspanol: "https://schema.org/Sunday",
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  saturdayVigil: "https://schema.org/Saturday",
  tuesdayEveningPrayer: "https://schema.org/Tuesday",
};

const DAY_INDEX = {
  sunday: 0,
  sundayEspanol: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  saturdayVigil: 6,
  tuesdayEveningPrayer: 2,
};

function nextOccurrence(dayKey, parsed, now = new Date()) {
  const targetDay = DAY_INDEX[dayKey];
  if (targetDay === undefined || !parsed) return null;

  const date = new Date(now);
  const offset = (targetDay - now.getDay() + 7) % 7;
  date.setDate(now.getDate() + offset);
  date.setHours(parsed.hours, parsed.minutes, 0, 0);
  if (date <= now) date.setDate(date.getDate() + 7);
  return date.toISOString();
}

function scheduleEvents(rows, name, location, now) {
  return (rows || []).flatMap(([dayKey, timeText]) =>
    extractMassTimes(timeText).map((timeStr) => {
      const parsed = parseMassTime(timeStr);
      const startDate = nextOccurrence(dayKey, parsed, now);
      return {
        "@type": "Event",
        name,
        startDate,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        inLanguage: dayKey === "sundayEspanol" ? "es" : "en",
        location,
        eventSchedule: {
          "@type": "Schedule",
          byDay: SCHEMA_DAY[dayKey],
          startTime: timeStr,
          repeatFrequency: "P1W",
        },
      };
    })
  );
}

export function buildMassTimesSchema(schedule, siteUrl, now = new Date()) {
  const location = {
    "@type": "Place",
    name: "St. Dominic Catholic Church",
    address: "77 East Lucius Avenue, Youngstown, OH 44507",
  };

  return {
    "@context": "https://schema.org",
    "@type": "CatholicChurch",
    name: "St. Dominic Catholic Church",
    url: `${siteUrl}/mass-times`,
    telephone: "+1-330-783-1900",
    event: [
      ...scheduleEvents(schedule?.sundayMass, "Mass", location, now),
      ...scheduleEvents(schedule?.dailyMass, "Daily Mass", location, now),
      ...scheduleEvents(schedule?.confession, "Confession", location, now),
      ...scheduleEvents(schedule?.adoration, "Eucharistic Adoration", location, now),
    ],
  };
}
