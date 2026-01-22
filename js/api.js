/**
 * Service API centralisé - PayeTonKawa
 */
class ApiService {
  constructor() {
    this.token = localStorage.getItem("ptk_token") || null;
    this.user = JSON.parse(localStorage.getItem("ptk_user") || "null");
  }

  // Headers par défaut avec authentification
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Méthode générique pour les requêtes
  async request(url, method = "GET", body = null) {
    const options = {
      method,
      headers: this.getHeaders(),
    };
    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
      this.logout();
      window.location.href = "/index.html";
      throw new Error("Session expirée");
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(error.message || "Erreur serveur");
    }

    if (response.status === 204) return null;
    return response.json();
  }

  // === AUTH SERVICE ===
  async register(email, password, role = "CLIENT") {
    return this.request(`${API_CONFIG.AUTH_URL}/auth/register`, "POST", {
      email,
      password,
      role,
    });
  }

  async login(email, password) {
    const data = await this.request(
      `${API_CONFIG.AUTH_URL}/auth/login`,
      "POST",
      { email, password },
    );
    if (data.access_token) {
      this.token = data.access_token;
      localStorage.setItem("ptk_token", data.access_token);
      // Décoder le token pour obtenir les infos utilisateur
      try {
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        this.user = payload;
        localStorage.setItem("ptk_user", JSON.stringify(payload));
      } catch (e) {
        console.error("Erreur décodage token", e);
      }
    }
    return data;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("ptk_token");
    localStorage.removeItem("ptk_user");
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.user?.role === "ADMIN";
  }

  // === USERS SERVICE (Admin) ===
  async getUsers() {
    return this.request(`${API_CONFIG.AUTH_URL}/users`);
  }

  async getUser(id) {
    return this.request(`${API_CONFIG.AUTH_URL}/users/${id}`);
  }

  async createUser(email, password, role) {
    return this.request(`${API_CONFIG.AUTH_URL}/users`, "POST", {
      email,
      password,
      role,
    });
  }

  async updateUser(id, data) {
    return this.request(`${API_CONFIG.AUTH_URL}/users/${id}`, "PATCH", data);
  }

  async deleteUser(id) {
    return this.request(`${API_CONFIG.AUTH_URL}/users/${id}`, "DELETE");
  }

  // === CUSTOMERS SERVICE ===
  async getCustomers() {
    return this.request(`${API_CONFIG.CLIENT_URL}/customers`);
  }

  async getCustomer(id) {
    return this.request(`${API_CONFIG.CLIENT_URL}/customers/${id}`);
  }

  async getMyProfile() {
    return this.request(`${API_CONFIG.CLIENT_URL}/customers/me`);
  }

  async createCustomer(data) {
    return this.request(`${API_CONFIG.CLIENT_URL}/customers`, "POST", data);
  }

  async updateCustomer(id, data) {
    return this.request(
      `${API_CONFIG.CLIENT_URL}/customers/${id}`,
      "PATCH",
      data,
    );
  }

  async deleteCustomer(id) {
    return this.request(`${API_CONFIG.CLIENT_URL}/customers/${id}`, "DELETE");
  }

  // === PRODUCTS SERVICE ===
  async getProducts() {
    return this.request(`${API_CONFIG.PRODUCT_URL}/products`);
  }

  async getProduct(id) {
    return this.request(`${API_CONFIG.PRODUCT_URL}/products/${id}`);
  }

  async createProduct(data) {
    return this.request(`${API_CONFIG.PRODUCT_URL}/products`, "POST", data);
  }

  async updateProduct(id, data) {
    return this.request(
      `${API_CONFIG.PRODUCT_URL}/products/${id}`,
      "PATCH",
      data,
    );
  }

  async deleteProduct(id) {
    return this.request(`${API_CONFIG.PRODUCT_URL}/products/${id}`, "DELETE");
  }

  // === ORDERS SERVICE ===
  async getOrders() {
    return this.request(`${API_CONFIG.ORDER_URL}/orders`);
  }

  async getMyOrders() {
    return this.request(`${API_CONFIG.ORDER_URL}/orders/my-orders`);
  }

  async getOrder(id) {
    return this.request(`${API_CONFIG.ORDER_URL}/orders/${id}`);
  }

  async createOrder(items) {
    return this.request(`${API_CONFIG.ORDER_URL}/orders`, "POST", { items });
  }
}

// Instance globale
const api = new ApiService();
