import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen px-2 pt-2 shadow-sm ">
            < Navbar />
            {/* Public Navbar */}
            <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-green-100" >
                {children}
            </main>
            <Footer />
        </div >
    )
}

export default MainLayout