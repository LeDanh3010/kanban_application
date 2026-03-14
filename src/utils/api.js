import axios from "axios";

const api = axios.create({ baseURL: "/api", withCredentials: true });

let accessToken = null;
export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

let refreshPromise = null;

export const doRefresh = () => {
    if (!refreshPromise) {
        refreshPromise = axios.post("/api/auth/refresh", {}, { withCredentials: true }).finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

api.interceptors.request.use(async (config) => {
    if (refreshPromise) {
        await refreshPromise.catch(() => {});
    }
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

api.interceptors.response.use((res) => res,
    async (error) => {
        const original = error.config; //all request config
        if (error.response?.status === 401 && !original._retry && !original.url.includes("/auth/")) {
            original._retry = true;
            try {
                const { data } = await doRefresh();
                console.log("data axios",data);
                setAccessToken(data.accessToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch {
                setAccessToken(null);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
