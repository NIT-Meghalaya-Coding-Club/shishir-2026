"use client"
import { createContext, useContext, useState } from "react";

const OrganizerContext = createContext();

export const OrganizerProvider = ({ children }) => {
    
    const [organizer, setOrganizer] = useState({ organizerData: null });

    const loginOrganizer = (organizerData) => {
        setOrganizer(organizerData);
    };

    const logoutOrganizer = () => {
        setOrganizer(null);
    };

    return (
        <OrganizerContext.Provider value={{ organizer, loginOrganizer, logoutOrganizer }}>
            {children}
        </OrganizerContext.Provider>
    );
};

export const useOrganizer = () => useContext(OrganizerContext);