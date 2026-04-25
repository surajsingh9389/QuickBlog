import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const { axios, setToken, setUser, navigate } = useAppContext();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await axios.post(endpoint, form);
      
      if (res.data.success) {
        const { token, user } = res.data;
        
        // Save to Context & LocalStorage
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success(isSignup ? "Account created!" : "Welcome back!");
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            {isSignup ? "Join Us" : "Login"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isSignup ? "Create an account to start blogging" : "Access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                className="w-full mt-1 p-3 border-b-2 border-gray-200 outline-none focus:border-primary transition-all"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-3 border-b-2 border-gray-200 outline-none focus:border-primary transition-all"
              placeholder="name@company.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-3 border-b-2 border-gray-200 outline-none focus:border-primary transition-all"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 shadow-lg transform transition active:scale-95"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          {isSignup ? "Already have an account?" : "New to the platform?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary font-bold hover:underline"
          >
            {isSignup ? "Login here" : "Register now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;