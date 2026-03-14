import api, { setAccessToken, doRefresh } from "./api";

export const authProvider = {
    isAuthenticated: false,
    user: null,

    async signin(username, password, remember = false) {
        const { data } = await api.post("/auth/login", { username, password, remember });
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
            const { data } = await doRefresh();
            setAccessToken(data.accessToken);
            authProvider.isAuthenticated = true;
            
            authProvider.user = { 
                id: data.user.id, 
                username: data.user.username, 
                role: data.user.role, 
                firstLogin: data.user.firstLogin 
            };
            return authProvider.user;
        } catch {
            authProvider.isAuthenticated = false;
            authProvider.user = null;
            return null;
        }
    },
};
