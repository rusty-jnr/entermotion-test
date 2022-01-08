import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Authorization from "../pages/authorization";
import Auth from "../pages/auth";
import Home from "../pages/Home";

const token = localStorage.getItem("access_token");

function PrivateRoute({ children }) {
  return token ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  return !token ? children : <Navigate to="/home" />;
}

const RoutePaths = () => (
  <Routes>
    <Route
      exact
      path="/"
      element={
        <PublicRoute>
          <Authorization />
        </PublicRoute>
      }
    />
    <Route
      exact
      path="/auth"
      element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      }
    />
    <Route
      exact
      path="/home"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default RoutePaths;
