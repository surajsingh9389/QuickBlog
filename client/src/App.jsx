import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Comments from './pages/admin/Comments'
import 'quill/dist/quill.snow.css';
import { Toaster } from "react-hot-toast"
import { useAppContext } from './context/AppContext'
import Auth from './pages/Auth'

const App = () => {
  const { token, user } = useAppContext();

  return (
    <div>
      <Routes>
        {/* GATEKEEPER ROUTE: 
          If no token, the Home path renders Auth (Login/Signup).
          If token exists, it renders the actual Home component.
        */}
        <Route path='/' element={token ? <Home /> : <Auth />} />

        {/* PROTECTED CONTENT ROUTES:
          These check if a token exists. If not, they redirect to root (which shows Auth).
        */}
        <Route 
          path='/blog/:id' 
          element={token ? <Blog /> : <Navigate to="/" />} 
        />

        {/* ADMIN ROUTES:
          Strictly protected by Token AND Admin Role.
        */}
        <Route 
          path='/admin' 
          element={
            token && user?.role === 'admin' ? <Layout /> : <Navigate to="/" />
          }
        > 
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
        </Route>

        {/* Fallback: Send everything else back to the Gatekeeper */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
