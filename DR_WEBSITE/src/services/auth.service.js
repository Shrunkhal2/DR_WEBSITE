const API_BASE_URL = "http://localhost:5001";

export const authService = {
  // --------------------
  // LOGIN
  // --------------------
  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    // Persist JWT + user
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  // --------------------
  // LOGOUT
  // --------------------
  logout() {
    this.forceLogout();
  },

  forceLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Hard redirect to clear app state
    window.location.href = "/login";
  },

  // --------------------
  // AUTH CHECK
  // --------------------
  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },

  // --------------------
  // CURRENT USER (JWT-PROTECTED)
  // --------------------
  async getCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      this.forceLogout();
      throw new Error("No token");
    }

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Token expired / invalid
    if (res.status === 401) {
      this.forceLogout();
      throw new Error("Session expired");
    }

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    return res.json();
  },
};