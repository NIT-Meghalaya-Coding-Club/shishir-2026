// Improved version focusing on responsiveness
"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import react-icons
import { 
  FaUserAlt, FaCalendarAlt, FaUniversity, FaIdCard, 
  FaGraduationCap, FaBookReader, FaPhone, FaEnvelope, 
  FaUtensils, FaBed, FaAmbulance, FaSignOutAlt, FaChevronDown, 
  FaChevronUp, 
  FaDesktop
} from "react-icons/fa";

//Components
import Loading from "../components/Loading";
import { canCreateEvents } from "./lib";
import { canCreateCommittees } from "./lib";

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
  // State and other variables remain the same
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

  // useEffect hooks remain the same

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch user-specific data code remains the same
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
          console.log("User data fetched:", data);
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
            alternateNumber: data.user?.alternateNumber ||"+91 XXXXXXXXXX",
            accommodation: data.user?.accommodation || false,
            nonVeg: data.user?.nonVeg || false,
            emergencyContact: data.user?.emergencyContact || "+91 XXXXXXXXXX",
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

  // Custom Components with improved responsiveness

  const CustomMoreButton = () => {
    return (
      <button
        onClick={() => setShowMoreInfo(!showMoreInfo)}
        className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-purple-900 to-blue-900 border border-indigo-500/30 hover:from-purple-800 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-purple-900/20 w-full sm:w-auto"
      >
        <span className="text-amber-300 font-medium text-sm sm:text-base">
          {showMoreInfo ? "Less Info" : "More Info"}
        </span>
        {showMoreInfo ? (
          <FaChevronUp className="text-amber-300" />
        ) : (
          <FaChevronDown className="text-amber-300" />
        )}
      </button>
    );
  };

  const CustomLogoutButton = () => {
    const handleLogout = () => {
      router.push("/api/auth/signout");
    };

    return (
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-indigo-500/30 hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-blue-900/20 w-full sm:w-auto"
      >
        <FaSignOutAlt className="text-amber-300" />
        <span className="text-amber-300 font-medium text-sm sm:text-base">Logout</span>
      </button>
    );
  };

  const CustomEventDashboardButton = () => {
    const goToEventDashboard = () => {
      router.push("/event-head/dashboard");
    }; 
    return (
      <button
        onClick={goToEventDashboard}
        className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-indigo-500/30 hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-blue-900/20 w-full sm:w-auto"
      >
        <span className="text-amber-300 font-medium text-sm sm:text-base">Event Dashboard</span>
      </button>
    )
  };

  const CustomCommitteDashboardButton = () => {
    const goToCommitteeDashboard = () => {
      router.push("/committee-head/dashboard")
    }
    return (
      <button
        onClick={goToCommitteeDashboard}
        className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-indigo-500/30 hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-blue-900/20 w-full sm:w-auto"
      >
        <FaDesktop className="text-amber-300" />
        <span className="text-amber-300 font-medium text-sm sm:text-base">Committee Dashboard</span>
      </button>
    )
  }

  const CustomContactInfo = ({ student }: { student: UserData }) => {
    return (
      <div className="w-full lg:w-1/2">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-amber-300 border-b border-amber-500/30 pb-2">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <FaEnvelope className="text-amber-400 mt-1 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-amber-100 text-xs sm:text-sm">Email</p>
              <p className="text-white text-sm sm:text-base break-words">{student.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FaPhone className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Phone Number</p>
              <p className="text-white text-sm sm:text-base">{student.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FaPhone className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Alternate Number</p>
              <p className="text-white text-sm sm:text-base">{student.alternateNumber}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomAdditionalInfo = ({ student }: { student: UserData }) => {
    return (
      <div className="w-full lg:w-1/2">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-amber-300 border-b border-amber-500/30 pb-2">
          Additional Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <FaBed className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Accommodation</p>
              <p className="text-white text-sm sm:text-base">
                {student.accommodation ? "Required" : "Not Required"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FaUtensils className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Food Preference</p>
              <p className="text-white text-sm sm:text-base">{student.nonVeg ? "Non-Vegetarian" : "Vegetarian"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FaAmbulance className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Emergency Contact</p>
              <p className="text-white text-sm sm:text-base">{student.emergencyContact}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="min-h-screen h-fit relative px-3 sm:px-5 max-w-full py-10 sm:py-20 bg-gradient-to-b from-[#0a0b2e] via-[#1a1155] to-[#0c1339] overflow-x-hidden">
        {isLoading && <Loading />}
        <div className="mx-auto md:absolute h-auto w-full sm:w-[90%] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 backdrop-blur-md bg-[#0d1445]/40 border border-indigo-500/30 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl shadow-purple-900/30 pt-10 sm:pt-16 md:pt-20">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 justify-center py-3 sm:py-5">
            <div>
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-[14vw] md:h-[14vw] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse"></div>
                <Image
                  src={userData.image !== "" ? userData.image : "/assets/profile-icon.svg"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-[10vw] md:h-[10vw] rounded-full shadow-xl object-cover absolute z-10"
                />
                <div className="w-full h-full rounded-full absolute animate-spin-slow">
                  <div className="w-full h-full rounded-full border-4 border-t-amber-400 border-r-purple-500 border-b-blue-600 border-l-indigo-600 animate-spin-slow"></div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left w-full">
              <h2 className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {userData.name}
              </h2>
              <div className="mt-1 text-sm sm:text-base md:text-lg flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="flex items-center">
                  <FaUserAlt className="text-amber-400 text-xs sm:text-sm md:text-base mr-1" /> 
                  <span className="text-amber-100">{userData.gender}</span>
                </span> 
                <span className="text-indigo-300">-</span>
                <span className="flex items-center">
                  <FaCalendarAlt className="text-amber-400 text-xs sm:text-sm md:text-base mr-1" /> 
                  <span className="text-amber-100">{new Date(userData.dob).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                </span>
              </div>
              
              <div className="mt-4 sm:mt-6 md:mt-8 text-xs md:text-sm space-y-2 sm:space-y-3 bg-blue-900/20 p-3 sm:p-4 rounded-lg backdrop-blur-md border border-indigo-500/20">
                <p className="flex flex-wrap items-center justify-center md:justify-start">
                  <span className="flex items-center mr-1 sm:mr-2">
                    <FaUniversity className="mr-1 text-amber-400 text-xs md:text-sm" /> 
                    <span className="text-indigo-200">College:</span>
                  </span>
                  <b className="ml-1 text-white truncate">{userData.college}</b>
                </p>
                
                <p className="flex flex-wrap items-center justify-center md:justify-start">
                  <span className="flex items-center mr-1 sm:mr-2">
                    <FaIdCard className="mr-1 text-amber-400 text-xs md:text-sm" /> 
                    <span className="text-indigo-200">College ID:</span>
                  </span>
                  <b className="ml-1 text-white">{userData.collegeId}</b>
                </p>
                
                <p className="flex flex-wrap items-center justify-center md:justify-start">
                  <span className="flex items-center mr-1 sm:mr-2">
                    <FaGraduationCap className="mr-1 text-amber-400 text-xs md:text-sm" /> 
                    <span className="text-indigo-200">Year of study:</span>
                  </span>
                  <b className="ml-1 text-white">{userData.yearOfStudy}</b>
                </p>
                
                <p className="flex flex-wrap items-center justify-center md:justify-start">
                  <span className="flex items-center mr-1 sm:mr-2">
                    <FaBookReader className="mr-1 text-amber-400 text-xs md:text-sm" /> 
                    <span className="text-indigo-200">Department:</span>
                  </span>
                  <b className="ml-1 text-white">{userData.department}</b>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
            <CustomMoreButton />
            {(canCreateEvents(userData))?
              <CustomEventDashboardButton />
              : ''
            }
            {(canCreateCommittees(userData))?
              <CustomCommitteDashboardButton />
              :''
            }
            <CustomLogoutButton />
          </div>
          <AnimatePresence>
            {showMoreInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row gap-5 lg:gap-10 p-3 sm:p-6 mt-4 overflow-hidden rounded-lg bg-gradient-to-r from-[#0a1147] to-[#151060] border border-indigo-500/20"
              >
                <CustomContactInfo student={userData} />
                <CustomAdditionalInfo student={userData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-[#1a1c6b] to-[#0c0e33] p-5 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm border border-indigo-500/30">
            <h2 className="text-xl sm:text-3xl font-bold text-amber-400 mb-2">Complete Your Registration</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-purple-500 mx-auto mb-4 rounded-full"></div>
            <p className="mt-2 text-sm sm:text-base text-indigo-100">You have not completed your registration. Please proceed to set up your profile.</p>
            <div className="flex flex-col mt-6 sm:mt-8 gap-3">
              <button
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 font-medium px-6 py-2 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                onClick={() => router.push("/dashboard/profile-details")}
              >
                Proceed to Registration
              </button>
              <button
                className="mt-2 bg-transparent border border-indigo-400/30 text-indigo-200 px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-900/20 transition-all duration-300 text-sm sm:text-base"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;