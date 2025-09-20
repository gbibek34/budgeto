import { useNavigate } from "react-router-dom"
import dash from "../assets/Dash.png"

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-16 px-4 md:px-12">
            {/* Text Section */}
            <div className="flex-1 flex flex-col items-start gap-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Track Your <span className="text-green-600">Finances!</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                    Take control of your financial life with <span className="font-semibold text-green-700">Budgeto</span>.
                    Easily manage your expenses, incomes, and budgets all in one place.
                </p>
                <button className="mt-2 px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-md shadow hover:bg-green-700 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    Get Started
                </button>
            </div>
            {/* Image Section */}
            <div className="flex-1 flex justify-center items-center">
                <img
                    className="w-full max-w-md h-auto object-contain"
                    src={dash}
                    alt="Dashboard Example"
                />
            </div>
        </section>
    )
}

export default Hero