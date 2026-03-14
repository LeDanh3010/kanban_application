import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const isPending = navigation.state === "loading";

    return (
        <div className="relative min-h-screen">
            {/* Top Loading Progress Bar */}
            <AnimatePresence>
                {isPending && (
                    <motion.div
                        initial={{ width: "0%", opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear] z-[9999]"
                    />
                )}
            </AnimatePresence>

            {/* Page Transition Wrapper */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MainLayout;