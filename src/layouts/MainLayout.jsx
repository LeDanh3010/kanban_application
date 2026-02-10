import { Outlet, useNavigation } from "react-router-dom";

const MainLayout = () => {
const navigation = useNavigation();
const isPending = navigation.state === "loading";
    return (
        <div className={`transition-opacity duration-300 ${isPending ? "opacity-0" : "opacity-100"}`}>
            <Outlet/>
        </div>
    );
};

export default MainLayout;