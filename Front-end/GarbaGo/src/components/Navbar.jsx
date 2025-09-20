import { MdMenu } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUserData } from "../redux/userDetails/UserSlice";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();

  const token = localStorage.getItem("garbagoToken");
  const role = localStorage.getItem("garbagoRole"); // "admin" or "user"

  const handleLogout = () => {
    localStorage.removeItem("garbagoToken");
    localStorage.removeItem("garbagoRole");
    localStorage.removeItem("garbagoUser");
    dispatch(clearUserData());
    window.location.href = "/login";
  };

  return (
    <header className="h-[60px] shadow-md w-full bg-white relative z-50 transition-all duration-300">
      <nav className="flex justify-between items-center h-full px-4 lg:px-10">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <MdMenu size={32} onClick={() => setSidebar(true)} className="cursor-pointer" />
          </div>
          <Link to="/" className="font-bold text-2xl">
            <span className="text-purple-600">Garba</span>Go
          </Link>
        </div>

        {/* Right Section */}
        <div
          className={`bg-white lg:bg-transparent fixed lg:static top-0 left-0 h-full lg:h-auto w-[260px] lg:w-auto shadow-lg lg:shadow-none p-6 lg:p-0
          transition-all duration-300 ease-in-out
          ${sidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="lg:hidden flex justify-between items-center mb-6">
            <p className="font-bold text-xl">
              <span className="text-purple-600">Garba</span>Go
            </p>
            <ImCross size={22} onClick={() => setSidebar(false)} className="cursor-pointer" />
          </div>

          <ul className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start lg:items-center">

            {/* Admin Tabs */}
            {role === "admin" && token && (
              <>
                <li>
                  <Link to="/organizeEvent" className="hover:text-purple-600 font-medium" onClick={() => setSidebar(false)}>
                    Organize Event
                  </Link>
                </li>
                <li>
                  <Link to="/manageEvent" className="hover:text-purple-600 font-medium" onClick={() => setSidebar(false)}>
                    Manage Event
                  </Link>
                </li>
                {/* ✅ New tab for admin to see booked events */}
                <li>
                  <Link to="/bookedEvents" className="hover:text-purple-600 font-medium" onClick={() => setSidebar(false)}>
                    Booked Events
                  </Link>
                </li>
              </>
            )}

            {/* User Tabs */}
            {role === "user" && token && (
              <>
                <li>
                  <Link to="/mybooking" className="hover:text-purple-600 font-medium" onClick={() => setSidebar(false)}>
                    My Booking
                  </Link>
                </li>
                <li>
                  <Link to="" className="hover:text-purple-600 font-medium" onClick={() => setSidebar(false)}>
                    Shop
                  </Link>
                </li>
              </>
            )}

            {/* Cart (visible for users) */}
            {role === "user" && token && (
              <li className="relative group">
                <div className="flex items-center gap-2 cursor-pointer hover:text-purple-600">
                  <FaCartShopping size={20} />
                  <span className="lg:hidden">Your Cart</span>
                </div>
                <div
                  className="absolute top-10 right-0 w-56 bg-white border rounded-md shadow-lg z-50
                  opacity-0 scale-95 pointer-events-none
                  group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                  transition-all duration-200 p-4 text-center"
                >
                  <p className="text-gray-500">Your Cart is Empty</p>
                  <Link to="/" className="text-purple-500 hover:underline">
                    Keep Shopping
                  </Link>
                </div>
              </li>
            )}

            {/* Auth Buttons */}
            {!token && (
              <div className="flex flex-col lg:flex-row gap-3">
                <Link
                  to="/login"
                  onClick={() => setSidebar(false)}
                  className="border border-purple-600 px-4 py-2 rounded-lg text-center font-bold hover:bg-purple-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setSidebar(false)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-center font-bold hover:bg-purple-500"
                >
                  Sign up
                </Link>
              </div>
            )}

            {token && (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-center font-bold hover:bg-purple-500"
                >
                  Log out
                </button>
              </li>
            )}

          </ul>
        </div>
      </nav>
    </header>
  );
}
