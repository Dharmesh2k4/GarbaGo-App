import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found | Eventify";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-purple-600">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-2xl shadow-md hover:bg-purple-700 transition duration-300"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
