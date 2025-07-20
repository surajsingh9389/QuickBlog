import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const {axios, setToken, navigate} = useAppContext();

  const logout = () => {
     localStorage.removeItem('token');
     axios.defaults.headers.common['Authorization'] = null;
     setToken(null);
     navigate('/');
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 px-4 h-[70px] sm:px-12 border-b border-gray-200 cursor-pointer">
        <img src={assets.logo} className='w-32 sm:s-40 cursor-pointer' alt="Logo" onClick={()=>navigate('/')} />
        <button onClick={logout} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5">
         Logout
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
      </div>

      <div className='flex h-[calc(100vh-70px)]'>
           <Sidebar/>
           <Outlet/>
      </div>
    </>
  )
}

export default Layout
