import React from 'react';
import { Link } from "react-router-dom";

export default function Home() {
    const buttons = [
        { name: 'Import Wallet', link: '/import', color: 'text-black', bgColor: 'bg-white' },
        { name: 'I already have wallet', link: '/import', color: 'text-white', bgColor: 'bg-gray-800' } 
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-5">
            {buttons.map((button, index) => (
                <Link 
                    key={index} 
                    to={button.link} 
                    className={`btn btn-active ${button.color} ${button.bgColor} py-2 rounded-full w-full max-w-xs text-center`}
                >
                    {button.name}
                </Link>
            ))}
        </div>
    );
}
