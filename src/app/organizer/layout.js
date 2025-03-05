"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import LogoutConfirmation from "../components/LogoutConfirmation";
import { useOrganizer } from "@/context/OrganizerContext";

const OrganizerLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state
  const { loginOrganizer, logoutOrganizer } = useOrganizer();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("/api/organizer/auth/verify", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          loginOrganizer(data.organizer);
          setIsAuthenticated(true); // User is authenticated
          setLoading(false);
        } else {
          setIsAuthenticated(false); // User not authenticated
          setLoading(false);
          if (pathname !== "/organizer/login") {
            router.push("/organizer/login");
          }
        }
      } catch (error) {
        console.error("Failed to verify token", error);
        setIsAuthenticated(false);
        setLoading(false);
        if (pathname !== "/organizer/login") {
          router.push("/organizer/login");
        }
      }
    };

    verifyUser();
  }, [router, loginOrganizer, pathname]);

  const handleLogout = async () => {
    setLogoutModal(false);
    try {
      const res = await fetch("/api/organizer/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        logoutOrganizer();
        setIsAuthenticated(false); // Reset authentication state
        toast.success("Logged out user!", { autoClose: 3000 });
        router.push("/organizer/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout user!", { autoClose: 3000 });
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Only render children if authenticated and not on login page
  if (!isAuthenticated && pathname !== "/organizer/login") {
    return null; // Prevent rendering until redirect happens
  }

  return (
    <div className="bg-white text-black min-h-screen md:px-60 md:py-20">
      {logoutModal && (
        <LogoutConfirmation
          title="Logout Account"
          message="Are you sure you want to logout? Click confirm to logout"
          handleCancel={() => setLogoutModal(false)}
          handleConfirm={handleLogout}
        />
      )}
      {children}
    </div>
  );
};

export default OrganizerLayout;