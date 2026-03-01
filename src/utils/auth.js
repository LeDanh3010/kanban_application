import api, { setAccessToken } from "./api";

export const authProvider = {
    isAuthenticated: false,
    user: null,

    async signin(username, password) {
        const { data } = await api.post("/auth/login", { username, password });
        setAccessToken(data.accessToken);
        authProvider.isAuthenticated = true;
        authProvider.user = data.user;
        return data.user;
    },

    async signout() {
        try { await api.post("/auth/logout"); } catch {}
        setAccessToken(null);
        authProvider.isAuthenticated = false;
        authProvider.user = null;
    },

    async checkAuth() {
        try {
            const { data } = await api.post("/auth/refresh");
            setAccessToken(data.accessToken);
            authProvider.isAuthenticated = true;
            
            const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
            authProvider.user = { id: payload.id, username: payload.username, role: payload.role };
            return authProvider.user;
        } catch {
            authProvider.isAuthenticated = false;
            authProvider.user = null;
            return null;
        }
    },
};
