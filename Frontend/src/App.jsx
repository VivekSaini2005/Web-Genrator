import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
      <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
        {/* Render Navbar globally across all pages */}
        <div className="flex-none">
          <Navbar />
        </div>
        
        {/* Main application engine area takes up all remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Requires Auth) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              {/* Dashboard/Editor/Projects fallback correctly directly back into home because Home explicitly operates as the main engine */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/editor" element={<Navigate to="/" replace />} />
              <Route path="/projects" element={<Navigate to="/" replace />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;