// src/context/OrganizerContext.js
import { createContext, useContext, useState, useCallback } from "react";

const OrganizerContext = createContext();

export const OrganizerProvider = ({ children }) => {
  const [organizer, setOrganizer] = useState(null);

  const loginOrganizer = useCallback((org) => {
    setOrganizer(org);
  }, []); // Empty deps since it only uses setOrganizer

  const logoutOrganizer = useCallback(() => {
    setOrganizer(null);
  }, []); // Empty deps since it only uses setOrganizer

  return (
    <OrganizerContext.Provider value={{ organizer, loginOrganizer, logoutOrganizer }}>
      {children}
    </OrganizerContext.Provider>
  );
};

export const useOrganizer = () => useContext(OrganizerContext);