/**
 * Configuration des URLs API - PayeTonKawa
 * Modifiez ces URLs selon votre environnement
 */

const HOST = window.location.hostname;

const API_CONFIG = {
  AUTH_URL: `http://${HOST}:3001`,
  CLIENT_URL: `http://${HOST}:3002`,
  PRODUCT_URL: `http://${HOST}:3003`,
  ORDER_URL: `http://${HOST}:3004`,
};

// Export pour les modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
