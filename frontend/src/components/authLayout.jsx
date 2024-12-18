import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = !!localStorage.getItem("accessToken");

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthLayout;
