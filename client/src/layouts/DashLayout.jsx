import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Custom hook to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return isMobile;
}

const DashLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const isMobile = useIsMobile();

    // Handler for menu button in Topbar
    const handleMenuClick = () => {
        if (isMobile) {
            setMobileSidebarOpen(true);
        } else {
            setSidebarCollapsed((prev) => !prev);
        }
    };

    return (
        <>
            <Topbar onMenuClick={handleMenuClick} />
            <div className="flex flex-1 min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar collapsed={sidebarCollapsed} />
                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <Sidebar
                            collapsed={false}
                            mobile={isMobile}
                            onClose={() => setMobileSidebarOpen(false)}
                        />
                        {/* Overlay */}
                        <div
                            className="bg-black bg-opacity-30"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                    </div>
                )}
                {/* Main Content */}
                <main
                    className={`
                    flex-1 p-4 md:p-8 transition-all duration-300
                    `}
                >
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
};

export default DashLayout;