/**
 * Configuration des URLs API - PayeTonKawa
 * Adaptative : Gère le mode Local (300x) et le mode Freebox Externe (2000x)
 */

const HOST = window.location.hostname;
const CURRENT_PORT = window.location.port;

// --- 1. Ports par défaut (Interne / IP Full Stack) ---
let ports = {
  auth: 3001,
  client: 3002,
  product: 3003,
  order: 3004,
};

// --- 2. Mode "Freebox Partagée" (Extérieur) ---
// Si le navigateur voit qu'on est sur le port 20080 (ton port frontend externe)
// Alors on force l'utilisation des ports externes pour les API aussi.
if (CURRENT_PORT === "20080") {
  console.log(
    "🌍 Mode Extérieur Freebox détecté : Bascule sur les ports 2000x",
  );
  ports.auth = 20001; // Redirige vers 3001
  ports.client = 20002; // Redirige vers 3002
  ports.product = 20003; // Redirige vers 3003
  ports.order = 20004; // Redirige vers 3004
}

const API_CONFIG = {
  AUTH_URL: `http://${HOST}:${ports.auth}`,
  CLIENT_URL: `http://${HOST}:${ports.client}`,
  PRODUCT_URL: `http://${HOST}:${ports.product}`,
  ORDER_URL: `http://${HOST}:${ports.order}`,
};

// Export pour les modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
