/**
 * Configuration des URLs API - PayeTonKawa
 * Modifiez ces URLs selon votre environnement
 */
const API_CONFIG = {
  AUTH_URL: "http://192.168.1.84:3001",
  CLIENT_URL: "http://192.168.1.84:3002",
  PRODUCT_URL: "http://192.168.1.84:3003",
  ORDER_URL: "http://192.168.1.84:3004",
};

// Export pour les modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
