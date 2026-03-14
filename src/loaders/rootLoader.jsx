import { redirect } from "react-router-dom";
import { authProvider } from "../utils/auth";

export default async function rootLoader() {
    if (authProvider.isAuthenticated) {
        return { user: authProvider.user };
    }
    const user = await authProvider.checkAuth();
    if (!user) return redirect("/login");
    if (user.firstLogin) return redirect("/first-login");
    return { user };
}
