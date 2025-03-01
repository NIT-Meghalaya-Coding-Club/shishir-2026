"use client";

import { useRouter } from "next/navigation";

//Toast
import { toast } from "react-toastify";

import React, { useEffect, useState } from "react";

//Components
import Loading from "../components/Loading";
import LogoutConfirmation from "../components/LogoutConfirmation";

//Context
import { useOrganizer } from "@/context/OrganizerContext";

const OrganzerLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  // const [organizer, setOrganizer] = useState(null);
  const { loginOrganizer, logoutOrganizer } = useOrganizer();
  const router = useRouter();
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
          router.push("/organizer/login");
        }
      } catch (error) {
        console.error("Failed to verify token", error);
        router.push("/organizer/login");
      }
    };

    verifyUser();
  }, [router, loginOrganizer]);

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
          handleCancel={() => {
            setLogoutModal(false);
          }}
          handleConfirm={handleLogout}
        />
      )}
      {children}
    </div>
  );
};

export default OrganzerLayout;
