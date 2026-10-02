import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-200 py-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-green-400">Budgeto</span>
                    <span className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="hover:text-green-400 transition-colors duration-200">About</a>
                    <a href="#" className="hover:text-green-400 transition-colors duration-200">Features</a>
                    <a href="#" className="hover:text-green-400 transition-colors duration-200">Contact</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer