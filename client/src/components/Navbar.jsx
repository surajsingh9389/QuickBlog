import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom'
import { useAppContext } from "../context/AppContext";

const Navbar = () => {

  const { navigate, token, user, logout } = useAppContext();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer">
      <img onClick={()=> navigate('/')} src={assets.logo} alt="logo" className="w-32 sm:w-44 cursor-pointer" />

      <div className="flex items-center gap-3">
        {token && user ? (
          <>
            {user.role === 'admin' && (
              <button onClick={()=> navigate('/admin')} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5">
                Admin Dashboard
                <img src={assets.arrow} alt="arrow" className="w-3" />
              </button>
            )}
            <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user.name}</span>
            <button onClick={logout} className="rounded-full text-sm cursor-pointer border border-primary text-primary px-5 py-2.5 hover:bg-primary hover:text-white transition-all">
              Logout
            </button>
          </>
        ) : (
          <button onClick={()=> navigate('/')} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5">
            Login
            <img src={assets.arrow} alt="arrow" className="w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
