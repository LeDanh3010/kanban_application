import { Outlet, redirect, useNavigation } from "react-router-dom";
import { authProvider } from "./utils/auth";

export const rootLoader = async () => {
  const user = authProvider.checkAuth();
  if (!user) {
    return redirect("/login");
  }
  return { user };
};

const App = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div 
      className={`transition-opacity duration-300 ${isNavigating ? "opacity-0" : "opacity-100"}`}
      style={{ willChange: "opacity" }}
    >
      <Outlet />
    </div>
  );
};

export default App;
