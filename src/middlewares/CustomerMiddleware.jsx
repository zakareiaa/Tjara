import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@contexts/Auth";

const VendorMiddleware = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser && currentUser.role == "customer" ? children : <Navigate to="/login" />;
};

export default VendorMiddleware;
