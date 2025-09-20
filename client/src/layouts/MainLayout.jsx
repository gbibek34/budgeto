import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="bg-gray-100 px-10 pt-10 shadow-sm">
            <div className="flex flex-col min-h-screen bg-white rounded-lg">
                {/* Public Navbar */}
                <Navbar />
                <main className="flex-grow flex flex-col px-4 py-8">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default MainLayout