// lib/translations.js
// Translation map for backend error messages (English to French)

const errorTranslations = {
  // General messages
  "Login successful": "Connexion réussie",
  "User registered successfully": "Inscription réussie",
  "Login failed": "Échec de la connexion",
  "Registration failed": "Échec de l'inscription",
  "Invalid credentials": "Identifiants incorrects",
  "Validation failed": "Erreur de validation",

  // Field validation messages
  "The username field is required.": "Le nom est requis",
  "The email field is required.": "L'email est requis",
  "The email field must be a valid email address.": "L'email doit être valide",
  "The email has already been taken.": "Cet email est déjà utilisé",
  "The password field is required.": "Le mot de passe est requis",
  "The password field must be at least 8 characters.":
    "Le mot de passe doit contenir au moins 8 caractères",
  "The password confirmation field is required.":
    "Veuillez confirmer votre mot de passe",
  "The password confirmation field and password must match.":
    "Les mots de passe ne correspondent pas",
  "These credentials do not match our records.":
    "Ces identifiants ne correspondent pas à nos enregistrements",

  // Rate limiting
  "Too many login attempts. Please try again in":
    "Trop de tentatives de connexion. Veuillez réessayer dans",
  "seconds.": "secondes.",
  "minute.": "minute.",
  "minutes.": "minutes.",
};

/**
 * Translate an error message from English to French
 * @param {string} message - The English error message
 * @returns {string} - The French translation or original message if not found
 */
export function translateError(message) {
  if (!message) return message;

  // Check for exact match first
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Check for partial matches (for dynamic messages like rate limiting)
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (message.includes(key)) {
      return message.replace(key, value);
    }
  }

  return message;
}

/**
 * Translate error object with field-specific errors
 * @param {Object} errors - Object with field names as keys and error messages as values
 * @returns {Object} - Translated errors object
 */
export function translateErrors(errors) {
  if (!errors || typeof errors !== "object") return errors;

  const translatedErrors = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      translatedErrors[field] = messages.map((msg) => translateError(msg));
    } else {
      translatedErrors[field] = translateError(messages);
    }
  }

  return translatedErrors;
}
