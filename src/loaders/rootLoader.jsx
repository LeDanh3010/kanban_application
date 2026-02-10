import { redirect } from "react-router-dom";
import { authProvider } from "../utils/auth";

const rootLoader = async () => {
  const user = authProvider.checkAuth();
  if (!user) {
    return redirect("/login");
  }
  return { user };
};

export default rootLoader;