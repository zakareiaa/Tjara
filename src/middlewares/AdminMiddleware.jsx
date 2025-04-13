import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@contexts/Auth";

const AdminMiddleware = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser && currentUser.role == "admin" ? children : <Navigate to="/login" />;
};

export default AdminMiddleware;
