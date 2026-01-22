/**
 * Utilitaires - PayeTonKawa
 */

// Afficher une notification toast
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-2xl shadow-lg z-50 
                       transform translate-x-full transition-transform duration-300 ease-out`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animer l'entrée
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-full");
  });

  // Supprimer après 3 secondes
  setTimeout(() => {
    toast.classList.add("translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Formater un prix
function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

// Formater une date
function formatDate(dateString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// Gestion du panier (localStorage)
const Cart = {
  KEY: "ptk_cart",

  get() {
    return JSON.parse(localStorage.getItem(this.KEY) || "[]");
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(product, quantity = 1) {
    const items = this.get();
    const existing = items.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    this.save(items);
    showToast(`${product.name} ajouté au panier`, "success");
  },

  remove(productId) {
    const items = this.get().filter((item) => item.productId !== productId);
    this.save(items);
  },

  updateQuantity(productId, quantity) {
    const items = this.get();
    const item = items.find((item) => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getTotal() {
    return this.get().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  getCount() {
    return this.get().reduce((count, item) => count + item.quantity, 0);
  },

  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.classList.toggle("hidden", count === 0);
    }
  },
};

// Vérifier l'authentification et rediriger si nécessaire
function requireAuth() {
  if (!api.isAuthenticated()) {
    window.location.href = "/index.html";
    return false;
  }
  return true;
}

// Vérifier les droits admin
function requireAdmin() {
  if (!api.isAuthenticated() || !api.isAdmin()) {
    window.location.href = "/index.html";
    return false;
  }
  return true;
}

// Afficher un loader
function showLoader(container) {
  container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
        </div>
    `;
}

// Modal générique
function showModal(
  title,
  content,
  onConfirm = null,
  confirmText = "Confirmer",
) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 transition-opacity duration-200";
  modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform scale-95 transition-transform duration-200 shadow-2xl">
            <h3 class="text-xl font-semibold mb-4">${title}</h3>
            <div class="text-gray-600 mb-6">${content}</div>
            <div class="flex gap-3 justify-end">
                <button class="modal-cancel px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                    Annuler
                </button>
                ${
                  onConfirm
                    ? `
                    <button class="modal-confirm px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium">
                        ${confirmText}
                    </button>
                `
                    : ""
                }
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    modal.querySelector(".bg-white").classList.remove("scale-95");
  });

  const close = () => {
    modal.classList.add("opacity-0");
    modal.querySelector(".bg-white").classList.add("scale-95");
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector(".modal-cancel").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  if (onConfirm) {
    modal.querySelector(".modal-confirm").addEventListener("click", () => {
      onConfirm();
      close();
    });
  }
}
