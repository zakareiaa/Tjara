import React, { createContext, useContext, useState, useEffect } from "react";
import { encryptData, decryptData, setChunkedCookies, getChunkedCookies, removeChunkedCookies } from '../helpers/helpers';

const AuthContext = createContext();

/* ---------------------------------------------------------------------------------------------- */
/*                                       The UseAuth Context                                      */
/* ---------------------------------------------------------------------------------------------- */

export function useAuth() {
  return useContext(AuthContext);
}

/* ---------------------------------------------------------------------------------------------- */
/*                    The Actual Provider Used For Rendring Childerns Inside It                   */
/* ---------------------------------------------------------------------------------------------- */

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Login Function                                        */
  /* -------------------------------------------------------------------------------------------- */
  const login = (userData) => {
    const encryptedData = encryptData(userData);
    if (encryptedData) {
      setChunkedCookies('user', encryptedData);
      setCurrentUser(userData);
      document.location.href = `/`;
    } else {
      console.error('Auth Token not found!');
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Logout Function                                       */
  /* -------------------------------------------------------------------------------------------- */
  const logout = () => {
    const user = getChunkedCookies('user');
    if (user) {
      removeChunkedCookies('user');
      setCurrentUser(null);
      document.location.reload();
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                       Storing And Check For User When Component Mounts                       */
  /* -------------------------------------------------------------------------------------------- */
  useEffect(() => {
    const user = getChunkedCookies('user');
    if (user) {
      const decryptedData = decryptData(user.toString());
      if (decryptedData) {
        setCurrentUser(decryptedData);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                    Exported All Functions                                    */
  /* -------------------------------------------------------------------------------------------- */
  const value = { currentUser, login, logout };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
