import { redirect } from "react-router-dom";
import { authProvider } from "../utils/auth";

export default async function rootLoader() {
    console.log("rootLoader");
    const user = await authProvider.checkAuth();
    if (!user) return redirect("/login");
    return { user };
}
