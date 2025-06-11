export function parseEventDate(rawDate) {
  if (rawDate instanceof Date) return rawDate;
  if (rawDate?.toDate) return rawDate.toDate();
  if (typeof rawDate === 'string') return new Date(rawDate);
  console.warn("Date inconnue:", rawDate);
  return new Date();
}

export function formatDate(date) {
  if (!(date instanceof Date)) return "Date invalide";
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export const MONTHS = {
  1: "janvier",
  2: "février",
  3: "mars",
  4: "avril",
  5: "mai",
  6: "juin",
  7: "juillet",
  8: "août",
  9: "septembre",
  10: "octobre",
  11: "novembre",
  12: "décembre",
};

export const getMonth = (date) => MONTHS[date.getMonth() + 1];
