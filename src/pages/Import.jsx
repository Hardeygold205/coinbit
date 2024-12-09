import React from "react";
import { Link } from "react-router-dom";
import Img1 from "../assets/Img1.svg";
import Img2 from "../assets/Img2.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function Import() {
    const tabs = [
        { 
            name: 'Enter recovery phrase or private key',
            link: '/input', 
            description: 'Securely import your wallet using your 12-word recovery phrase or private key',
            image: Img2
        },
        { 
            name: 'Connect Ledger wallet', 
            link: '/input', 
            description: 'Approve transactions using a Ledger device (Ethereum only). A new tab will open',
            image: Img1
        }
    ];

    return (
        <div className="p-8 mt-12 flex flex-col items-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="w-full sm:w-3/4 lg:w-[67%] max-w-md">
                <div className="mb-4">
                    <Link to="/">
                        <FontAwesomeIcon icon={faLeftLong} />
                        <p className="p-0 text-[0.4rem]">BACK</p>
                    </Link>
                </div>
                <div className="mb-4">
                    <h1 className=" text-2xl font-bold">Use an existing wallet</h1>
                    <p className="py-5">Select how you&apos;d like to access your existing wallet</p>
                </div>
                <div className="space-y-4">
                    {tabs.map((tab, index) => (
                        <Link to={tab.link} key={index} className="block p-5 outline outline-1 outline-gray-500 rounded-lg">
                            <div className="flex justify-center justify-items-center" >
                                <div className="flex-1 w-90">
                                    <h2 className=" text-lg font-semibold">{tab.name}</h2>
                                    <p className="text-gray-400 mt-2">{tab.description}</p>
                                </div>
                                <div className="flex w-10">
                                    <img src={tab.image} alt={tab.name} className="w-full" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <p className=" text-2 font-bold">Link CoinBit Wallet mobile app</p>
                </div>
            </div>
        </div>
    );
}