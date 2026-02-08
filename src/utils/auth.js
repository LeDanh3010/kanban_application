export const authProvider = {
  isAuthenticated: false,
  username: null,
  role: null,
  
  async signin(username, password) {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    
    // Mock validation
    let user = null;
    if (username === "admin" && password === "admin") {
      user = { name: "Admin User", role: "admin", username };
    } else if (username === "leader" && password === "leader") {
      user = { name: "Leader User", role: "leader", username };
    } else if (username === "user" && password === "user") {
      user = { name: "Normal User", role: "user", username };
    }

    if (user) {
      authProvider.isAuthenticated = true;
      authProvider.username = username;
      authProvider.role = user.role;
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    return user;
  },

  async signout() {
    await new Promise((r) => setTimeout(r, 500));
    authProvider.isAuthenticated = false;
    authProvider.username = null;
    authProvider.role = null;
    localStorage.removeItem("user");
  },

  checkAuth() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      authProvider.isAuthenticated = true;
      authProvider.username = user.username;
      authProvider.role = user.role;
      return user;
    }
    return null;
  }
};
