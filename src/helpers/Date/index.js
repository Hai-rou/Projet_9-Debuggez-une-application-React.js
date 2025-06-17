// Fonction qui nettoie et standardise n’importe quelle date entrée
export function parseEventDate(rawDate) {
  // Si rawDate est déjà une instance Date JS → on la retourne directement (pas besoin de parsing)
  if (rawDate instanceof Date) return rawDate;

  // Cas particulier (ex: Firestore) : si l'objet possède une méthode toDate()
  if (rawDate?.toDate) return rawDate.toDate();

  // Si c'est une chaîne de caractères (ex: format ISO string), on utilise le constructeur Date
  if (typeof rawDate === 'string') return new Date(rawDate);

  // Si aucun des cas précédents, on log un warning pour debugging
  console.warn("Date inconnue:", rawDate);

  // On retourne la date actuelle comme fallback (évite de crasher l'application)
  return new Date();
}

// Fonction qui formate une date (objet Date) au format "jj mois aaaa" en français
export function formatDate(date) {
  // Si l'entrée n'est pas une Date valide, on retourne un message d'erreur
  if (!(date instanceof Date)) return "Date invalide";

  // Sinon on utilise l'API native de JS pour formater la date en français
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Dictionnaire des mois en français (sert à afficher uniquement le mois)
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

// Fonction utilitaire qui extrait le mois de la date (objet Date) et retourne le mois en français
export const getMonth = (date) => MONTHS[date.getMonth() + 1];
// getMonth() de JS retourne un index 0-based (0=janvier, 11=décembre), donc on ajoute +1 pour accéder à la clé du dictionnaire MONTHS
