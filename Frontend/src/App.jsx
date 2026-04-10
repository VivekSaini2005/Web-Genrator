import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";

// Simple placeholders to ensure the app doesn't crash 
// if Login/Register/Dashboard files are unavailable right now.
const Placeholder = ({ title }) => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-slate-300 text-xl font-medium">
    {title} - Under Construction
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout-fluid relative flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">  
        {/* Subtle Background Effect */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
        <div className="fixed inset-0 bg-premium-noise pointer-events-none" />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

          {/* Protected Routes (Requires Auth) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;