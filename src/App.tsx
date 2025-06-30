import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Criteria from "./components/Criteria";
import Alternatives from "./components/Alternatives";
import Calculation from "./components/Calculation";
import NotFound from "./components/NotFound";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <div
        className={`container ${
          !isAuthenticated ? "p-0 m-0 container-fluid" : "mt-4"
        }`}
      >
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Calculation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/criteria"
            element={
              <ProtectedRoute>
                <Criteria />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alternatives"
            element={
              <ProtectedRoute>
                <Alternatives />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
