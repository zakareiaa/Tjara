import React, { createContext, useContext, useState, useEffect } from "react";
const ContextProvider = createContext();
import SETTINGS from "@client/settingsClient.js";
import logo from "@assets/logo.svg";

export const useheaderFooter = () => {
    return useContext(ContextProvider)
}

export const GlobalHeaderFooter = ({ children }) => {
    const [globalSettings, setglobalSettings] = useState({});

    /* -------------------------------------------- X ------------------------------------------- */

    const fetchGlobalSettings = async () => {
        const { data, error } = await SETTINGS.getSettings();
        if (data) {
            setglobalSettings(data?.options);
        }

        if (error) {
            console.error(`Error fetching global settings: ${error}`)
        }
    }

    /* -------------------------------------------- X ------------------------------------------- */

    useEffect(() => {
        fetchGlobalSettings();
    }, []);

    /* -------------------------------------------- X ------------------------------------------- */

    return <ContextProvider.Provider value={{ globalSettings }}>{children}</ContextProvider.Provider>
}