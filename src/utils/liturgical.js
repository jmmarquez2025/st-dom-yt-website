/**
 * Liturgical season utilities.
 *
 * Computes the approximate liturgical season for a given date,
 * used for dynamic theming and accent colors.
 *
 * NOTE: This is an approximation. A full liturgical calendar requires
 * complex Easter-dating rules. This covers the major seasons accurately.
 */

/**
 * Compute Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 */
function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Liturgical seasons with their associated colors.
 */
// Colors are muted, warm-leaning, and harmonized with the burgundy + gold brand,
// while remaining recognizable as their liturgical color. Each `accent` is a close
// lighter sibling of `color` so the banner gradient reads as one calm surface
// rather than a harsh two-hue transition.
export const SEASONS = {
  advent:    { key: "advent",    color: "#4C3A63", accent: "#6E5A86", name: "Advent" },
  christmas: { key: "christmas", color: "#B9924A", accent: "#E2C98C", name: "Christmas" },
  lent:      { key: "lent",     color: "#4A2B52", accent: "#6B4F73", name: "Lent" },
  triduum:   { key: "triduum",  color: "#6E1F22", accent: "#8A2B27", name: "Sacred Triduum" },
  easter:    { key: "easter",   color: "#C7A65C", accent: "#EBD9A8", name: "Easter" },
  ordinary:  { key: "ordinary", color: "#3A6B4F", accent: "#5E8C6A", name: "Ordinary Time" },
};

// Festal gold seasons render light; their banner uses dark text for WCAG AA contrast.
export const GOLD_SEASONS = new Set(["christmas", "easter"]);

/**
 * Determine the liturgical season for a given date.
 * Returns one of the SEASONS objects.
 */
export function getLiturgicalSeason(date = new Date()) {
  const year = date.getFullYear();
  const easter = easterDate(year);

  // Key dates
  const ashWednesday = addDays(easter, -46);
  const holyThursday = addDays(easter, -3);
  const easterEnd = addDays(easter, 49); // Pentecost Sunday

  // Christmas season: Dec 25 of previous year → Baptism of the Lord (~Jan 9-13)
  // Simplified: Dec 25 – Jan 13
  const jan1 = new Date(year, 0, 1);
  const jan13 = new Date(year, 0, 13);
  const dec25 = new Date(year, 11, 25);

  // Advent: 4 Sundays before Dec 25
  // Find the Sunday on or before Dec 24, then go back 3 more weeks
  const dec24 = new Date(year, 11, 24);
  const dayOfWeek24 = dec24.getDay();
  const fourthSundayAdvent = addDays(dec24, -dayOfWeek24);
  const adventStart = addDays(fourthSundayAdvent, -21);

  if (date >= jan1 && date <= jan13) return SEASONS.christmas;
  if (date >= ashWednesday && date < holyThursday) return SEASONS.lent;
  if (date >= holyThursday && date < easter) return SEASONS.triduum;
  if (date >= easter && date <= easterEnd) return SEASONS.easter;
  if (date >= adventStart && date < dec25) return SEASONS.advent;
  if (date >= dec25) return SEASONS.christmas;

  return SEASONS.ordinary;
}
