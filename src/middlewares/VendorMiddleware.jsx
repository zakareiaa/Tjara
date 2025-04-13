import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@contexts/Auth";

const CustomerMiddleware = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser && currentUser.role == "vendor" ? children : <Navigate to="/login" />;
};

export default CustomerMiddleware;
