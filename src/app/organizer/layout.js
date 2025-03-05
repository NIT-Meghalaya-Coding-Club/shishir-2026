// src/app/organizer/layout.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import LogoutConfirmation from "../components/LogoutConfirmation";
import { useOrganizer } from "@/context/OrganizerContext";

const OrganizerLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { loginOrganizer, logoutOrganizer } = useOrganizer();
  const router = useRouter();
  const pathname = usePathname(); // Get current path
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
          setLoading(false);
        } else {
          setLoading(false);
          if (pathname !== "/organizer/login") { // Only redirect if not already on login
            router.push("/organizer/login");
          }
        }
      } catch (error) {
        console.error("Failed to verify token", error);
        if (pathname !== "/organizer/login") { // Only redirect if not already on login
          router.push("/organizer/login");
        }
      }
    };

    verifyUser();
  }, [router, loginOrganizer, pathname]); // Add pathname as dependency

  const handleLogout = async () => {
    setLogoutModal(false);
    try {
      const res = await fetch("/api/organizer/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        logoutOrganizer();
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