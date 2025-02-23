"use client";

import Image from "next/image";
import MoreButton from "@/components/dashboard/MoreButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import ContactInfo from "@/components/dashboard/ContactInfo";
import AdditionalInfo from "@/components/dashboard/AdditionalInfo";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

//Components
import Loading from "../components/Loading";


type UserData = {
  name: string;
  gender: string;
  dob: string;
  college: string;
  collegeId: string;
  yearOfStudy: string;
  department: string;
  email: string;
  phoneNumber: string;
  alternateNumber: string;
  accommodation: boolean;
  nonVeg: boolean;
  emergencyContact: string;
  image: string;
  registered: boolean;
};

const ProfileCard = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    gender: "",
    dob: "",
    college: "",
    collegeId: "",
    yearOfStudy: "",
    department: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
    accommodation: true,
    nonVeg: false,
    emergencyContact: "",
    image: "",
    registered: false,
  });

  const { data: session, status } = useSession();
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);



  useEffect(() => {
    // Fetch user-specific data
    const fetchUserData = async () => {
      if (!session?.user?.email || dataFetched) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/user/get-info/${session.user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.user?.name || "",
            gender: data.user?.gender || "",
            dob: data.user?.dob || "DD / MM / YYYY",
            college: data.user?.college || "",
            collegeId: data.user?.collegeID || "XXXXXXXX",
            yearOfStudy: data.user?.yearOfStudy || "",
            department: data.user?.dept || "",
            email: data.user?.email || "",
            phoneNumber: data.user?.phone || "+91 XXXXXXXXXX",
            alternateNumber: "+91 XXXXXXXXXX",
            accommodation: data.user?.accommodation || false,
            nonVeg: data.user?.nonVeg || false,
            emergencyContact: "Doraemon",
            image: data.user?.image || "",
            registered: data.user?.registered || false
          });

          setIsLoading(false);
          setDataFetched(true);

          // If the user is not registered, prompt for registration
          if (!data.user?.registered) {
            setTimeout(() => {
              setShowModal(true);
            }, 1000);
          }

        } else {
          console.error("Failed to fetch user data");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, router, dataFetched]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Lock scroll
    } else {
      document.body.style.overflow = "auto"; // Unlock scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Ensure unlock on unmount
    };
  }, [showModal]);


  return (
    <div>
      <div className="min-h-screen wrapper h-fit relative px-5 w-screen md:pt-0 py-20">
        {isLoading && <Loading />}
        <div className="box mx-auto md:absolute h-auto w-full md:w-[55vw] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 backdrop-blur-md bg-white/10 border border-yellow-400/20 text-white p-6 rounded-lg shadow-lg">
          <div className="flex md:flex-row flex-col items-center gap-10 justify-center py-5">
            <div>
              <div className="circle">
                <div className="relative w-[70vw] h-[70vw] md:w-[14vw] md:h-[14vw] flex items-center justify-center">
                  <Image
                    src={userData.image !== "" ? userData.image : "/assets/profile-icon.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-[50vw] h-[50vw] md:w-[10vw] md:h-[10vw] rounded-full shadow-xl object-cover absolute"
                  />
                  <Image
                    src={"/img/frame_new.webp"}
                    alt="Profile Frame"
                    width={196}
                    height={196}
                    className="w-[70vw] h-[70vw] md:w-full md:h-full rounded-full object-cover absolute animate-spin-slow"
                  />
                </div>
              </div>
            </div>
            <div className="md:text-left ">
              <div className="Name text-2xl md:text-4xl font-mono font-bold">
                {userData.name}
              </div>
              <div className="Gender_DOB mt-1 text-lg md:text-xl font-mono">
                {userData.gender} - {new Date(userData.dob).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="college_info mt-10 text-sm md:text-md font-mono space-y-2">
                <p>College : <b>{userData.college}</b></p>
                <p>College ID : <b>{userData.collegeId}</b></p>
                <p>Year of study : <b>{userData.yearOfStudy}</b></p>
                <p>Department : <b>{userData.department}</b></p>
              </div>
            </div>
          </div>
          <div className="more_button mt-10 flex justify-center gap-5">
            <MoreButton showMoreInfo={showMoreInfo} setShowMoreInfo={setShowMoreInfo} />
            <LogoutButton />
          </div>
          <AnimatePresence>
            {showMoreInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base flex md:flex-row flex-col gap-10 p-10  md:text-lg text-amber-50 overflow-hidden"
              >
                <ContactInfo student={userData} />
                <AdditionalInfo student={userData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-gradient-to-b from-blue-900 to-black p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-3xl font font-semibold text-amber-500">Complete Your Registration</h2>
            <p className="mt-2 text-white">You have not completed your registration. Please proceed.</p>
            <button
              className="mt-4 bg-gradient-to-r from-amber-300 to-amber-500 text-black px-4 py-2 rounded hover:scale-105 transition-all duration-150"
              onClick={() => router.push("/dashboard/profile-details")}
            >
              Proceed
            </button>
            <button
              className="mt-4 bg-none border border-amber-500 border-opacity-40 ml-3 text-white px-4 py-2 rounded hover:scale-105 transition-all duration-150"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileCard;
