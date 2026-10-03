// Improved version focusing on responsiveness
"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Pencil } from "lucide-react";

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
import ImageCropper from "@/components/ImageCropper";

const configuredProfileSizeMb = Number(process.env.NEXT_PUBLIC_PROFILE_MAX_SIZE_MB);
const PROFILE_MAX_SIZE_MB = Number.isFinite(configuredProfileSizeMb) && configuredProfileSizeMb > 0
  ? configuredProfileSizeMb
  : 1;

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
  canCreateEvents?: boolean;
  canCreateCommittees?: boolean;
  hasEventAccess?: boolean;
  hasCommitteeAccess?: boolean;
};

type RegisteredEvent = {
  id: string;
  eventId: string;
  name: string;
  category: string;
  location: string;
  startsAt: string;
  endsAt: string;
  eventType: "individual" | "team" | "performance";
  role: string;
  groupName: string | null;
  participantCount: number;
};

/* ──────────────────────────────────────────────────────────────
   Palette
   Dusk Blue #3D5A80 · Powder Blue #98C1D9 · Burnt Peach #EE6C4D
   Light Cyan #E0FBFC · Jet Black #293241
   ────────────────────────────────────────────────────────────── */

const PETAL_COLORS = ["#F9C9C4", "#F4A9A0", "#EE6C4D", "#FBDDD9", "#F6B7B0"];

const paperGrain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const paperCls =
  "bg-gradient-to-br from-white via-[#F3FCFC] to-[#DDF1F5] dark:from-[#3b4d6b] dark:via-[#33435e] dark:to-[#2c3a52]";

const insetCls =
  "rounded-md border border-[#98C1D9] bg-white/70 dark:bg-[#293241]/50 dark:border-[#98C1D9]/30";

const btnBase =
  "flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-md font-semibold text-sm sm:text-base w-full sm:w-auto transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] focus-visible:ring-offset-2";

function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.2"
          rx="3.6"
          ry="5"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill="#E0FBFC" />
      <circle cx="12" cy="12" r="0.9" fill="#EE6C4D" />
    </svg>
  );
}

function SectionTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Blossom className="w-4 h-4 text-[#EE6C4D] shrink-0" />
      <h3
        id={id}
        className="text-lg sm:text-xl font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]"
      >
        {children}
      </h3>
      <div className="h-px flex-1 bg-gradient-to-r from-[#98C1D9] to-transparent" />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 -rotate-3 items-center justify-center rounded-md bg-[#EE6C4D]/10 text-[#EE6C4D]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-[#3D5A80] dark:text-[#98C1D9]">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-[#293241] dark:text-[#E0FBFC] break-words">
          {children}
        </p>
      </div>
    </div>
  );
}

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
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [profileFileToCrop, setProfileFileToCrop] = useState<File | null>(null);
  const profileFileInput = useRef<HTMLInputElement>(null);

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
            image: data.user?.image || session.user?.image || "",
            registered: data.user?.registered || false,
            canCreateEvents: data.canCreateEvents || false,
            canCreateCommittees: data.canCreateCommittees || false,
            hasEventAccess: data.hasEventAccess || false,
            hasCommitteeAccess: data.hasCommitteeAccess || false,
          });

          setIsLoading(false);
          setDataFetched(true);

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
    if (status !== "authenticated") return;

    const fetchRegisteredEvents = async () => {
      setEventsLoading(true);
      try {
        const response = await fetch("/api/user/registrations", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch registered events");

        const data = await response.json();
        setRegisteredEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching registered events:", error);
        setRegisteredEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [status]);

  const uploadProfileImage = async (file: File) => {
    setIsUploadingProfile(true);

    try {
      const presignResponse = await fetch("/api/uploads/profile/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, fileSize: file.size }),
      });
      const presignData = await presignResponse.json();

      if (!presignResponse.ok) {
        throw new Error(
          presignData.message || "Could not prepare profile picture upload"
        );
      }

      const uploadResponse = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Could not upload profile picture");
      }

      const email = session?.user?.email || userData.email;
      const updateResponse = await fetch(
        `/api/user/update/${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: presignData.publicUrl }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Could not save profile picture");
      }

      setUserData((previous) => ({
        ...previous,
        image: presignData.publicUrl,
      }));
    } catch (error) {
      console.error("Profile picture update failed:", error);
      alert(error instanceof Error ? error.message : "Could not update profile picture");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      alert("Profile picture must be a JPEG, PNG, or WebP image");
      return;
    }

    setProfileFileToCrop(file);
  };

  // Custom Components with improved responsiveness

  const CustomMoreButton = () => {
    return (
      <button
        onClick={() => setShowMoreInfo(!showMoreInfo)}
        className={`${btnBase} bg-[#EE6C4D] text-white shadow-[0_10px_22px_-10px_rgba(238,108,77,0.8)] hover:shadow-[0_14px_28px_-10px_rgba(238,108,77,0.9)]`}
      >
        <span>{showMoreInfo ? "Less Info" : "More Info"}</span>
        {showMoreInfo ? <FaChevronUp /> : <FaChevronDown />}
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
        className={`${btnBase} border border-[#3D5A80] text-[#3D5A80] bg-white/60 hover:bg-[#3D5A80] hover:text-white dark:border-[#98C1D9] dark:text-[#98C1D9] dark:bg-transparent dark:hover:bg-[#98C1D9] dark:hover:text-[#293241]`}
      >
        <FaSignOutAlt />
        <span>Logout</span>
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
        className={`${btnBase} bg-[#3D5A80] text-white shadow-[0_10px_22px_-10px_rgba(61,90,128,0.8)] hover:bg-[#33506f]`}
      >
        <span>Event Dashboard</span>
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
        className={`${btnBase} bg-[#3D5A80] text-white shadow-[0_10px_22px_-10px_rgba(61,90,128,0.8)] hover:bg-[#33506f]`}
      >
        <FaDesktop />
        <span>Committee Dashboard</span>
      </button>
    )
  }

  const CustomContactInfo = ({ student }: { student: UserData }) => {
    return (
      <div className="w-full lg:w-1/2">
        <h3 className="mb-4 border-b border-[#EE6C4D]/40 pb-2 text-lg sm:text-xl font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
          Contact Information
        </h3>
        <div className="space-y-4">
          <InfoRow icon={<FaEnvelope />} label="Email">
            {student.email}
          </InfoRow>
          <InfoRow icon={<FaPhone />} label="Phone Number">
            {student.phoneNumber}
          </InfoRow>
          <InfoRow icon={<FaPhone />} label="Alternate Number">
            {student.alternateNumber}
          </InfoRow>
        </div>
      </div>
    );
  };

  const CustomAdditionalInfo = ({ student }: { student: UserData }) => {
    return (
      <div className="w-full lg:w-1/2">
        <h3 className="mb-4 border-b border-[#EE6C4D]/40 pb-2 text-lg sm:text-xl font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
          Additional Information
        </h3>
        <div className="space-y-4">
          <InfoRow icon={<FaBed />} label="Accommodation">
            {student.accommodation ? "Required" : "Not Required"}
          </InfoRow>
          <InfoRow icon={<FaUtensils />} label="Food Preference">
            {student.nonVeg ? "Non-Vegetarian" : "Vegetarian"}
          </InfoRow>
          <InfoRow icon={<FaAmbulance />} label="Emergency Contact">
            {student.emergencyContact}
          </InfoRow>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative flex min-h-screen max-w-full items-start justify-center overflow-x-hidden bg-[#E0FBFC] px-3 py-10 sm:px-5 sm:py-20 dark:bg-[#293241]">
        {/* Backdrop: static glows and a few drifting petals (no blur filters) */}
        <div
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(ellipse_at_12%_15%,rgba(152,193,217,0.5),transparent_55%),radial-gradient(ellipse_at_88%_92%,rgba(238,108,77,0.14),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_12%_15%,rgba(61,90,128,0.5),transparent_55%),radial-gradient(ellipse_at_88%_92%,rgba(238,108,77,0.1),transparent_50%)]"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const size = 9 + (i % 4) * 3;
            return (
              <span
                key={i}
                className="pc-petal absolute top-0"
                style={
                  {
                    left: `${(i * 12.5 + 5) % 100}%`,
                    width: size,
                    height: size * 1.25,
                    background: PETAL_COLORS[i % PETAL_COLORS.length],
                    borderRadius: "100% 0 100% 0",
                    animationDuration: `${16 + ((i * 5) % 9)}s`,
                    animationDelay: `-${(i * 3.7) % 18}s`,
                    "--drift": `${(i % 2 ? 1 : -1) * (60 + ((i * 29) % 140))}px`,
                    "--spin": `${(i % 2 ? 1 : -1) * (240 + ((i * 41) % 300))}deg`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>

        {isLoading && <Loading />}

        <div
          className={`pc-rise relative z-10 mx-auto h-auto w-full overflow-hidden rounded-[3px] border-y-[6px] border-[#3D5A80] shadow-[0_28px_70px_-20px_rgba(61,90,128,0.55),0_0_0_1px_rgba(152,193,217,0.5)] sm:w-[90%] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] dark:border-[#98C1D9] ${paperCls}`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply dark:opacity-40"
            style={{ backgroundImage: paperGrain }}
          />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D]" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D]" />

          <div className="relative z-10 m-2 rounded-[2px] border border-[#3D5A80]/20 p-4 pt-8 sm:m-3 sm:p-6 sm:pt-12 md:p-8 md:pt-14 dark:border-[#98C1D9]/30">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 justify-center py-3 sm:py-5">
              <div>
                {/* Photo with a Peach to Powder Blue ring */}
                <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44 md:h-[13vw] md:w-[13vw] md:min-h-[150px] md:min-w-[150px]">
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#EE6C4D] via-[#F6B7B0] to-[#98C1D9] p-1 shadow-[0_14px_30px_-12px_rgba(61,90,128,0.6)]">
                    <Image
                      src={userData.image !== "" ? userData.image : "/assets/profile-icon.svg"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-full w-full rounded-full border-[3px] border-white object-cover dark:border-[#293241]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => profileFileInput.current?.click()}
                    title={isUploadingProfile ? "Uploading profile picture" : "Change profile picture"}
                    aria-label="Change profile picture"
                    disabled={isUploadingProfile}
                    className="absolute bottom-1 right-1 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#EE6C4D] text-white shadow-lg transition duration-200 hover:scale-110 hover:rotate-6 disabled:cursor-wait disabled:opacity-60 dark:border-[#293241]"
                  >
                    {isUploadingProfile ? (
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Pencil size={16} aria-hidden="true" />
                    )}
                  </button>
                  <input
                    ref={profileFileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfileImageChange}
                    className="sr-only"
                  />
                </div>
              </div>
              <div className="text-center md:text-left w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#EE6C4D] drop-shadow-[0_4px_18px_rgba(238,108,77,0.25)]">
                  {userData.name}
                </h2>
                <div className="mt-2 text-sm sm:text-base md:text-lg flex flex-wrap items-center justify-center md:justify-start gap-2 text-[#293241] dark:text-[#E0FBFC]">
                  <span className="flex items-center">
                    <FaUserAlt className="mr-1.5 text-xs sm:text-sm md:text-base text-[#EE6C4D]" /> 
                    <span>{userData.gender}</span>
                  </span> 
                  <Blossom className="h-3 w-3 text-[#F4A9A0]" />
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1.5 text-xs sm:text-sm md:text-base text-[#EE6C4D]" /> 
                    <span>{new Date(userData.dob).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </span>
                </div>
                
                <div className={`${insetCls} mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3 p-3 sm:p-4 text-xs md:text-sm`}>
                  <p className="flex flex-wrap items-center justify-center md:justify-start">
                    <span className="mr-1 flex items-center sm:mr-2">
                      <FaUniversity className="mr-1.5 text-xs md:text-sm text-[#EE6C4D]" /> 
                      <span className="text-[#3D5A80] dark:text-[#98C1D9]">College:</span>
                    </span>
                    <b className="ml-1 truncate text-[#293241] dark:text-[#E0FBFC]">{userData.college}</b>
                  </p>
                  
                  <p className="flex flex-wrap items-center justify-center md:justify-start">
                    <span className="mr-1 flex items-center sm:mr-2">
                      <FaIdCard className="mr-1.5 text-xs md:text-sm text-[#EE6C4D]" /> 
                      <span className="text-[#3D5A80] dark:text-[#98C1D9]">College ID:</span>
                    </span>
                    <b className="ml-1 text-[#293241] dark:text-[#E0FBFC]">{userData.collegeId}</b>
                  </p>
                  
                  <p className="flex flex-wrap items-center justify-center md:justify-start">
                    <span className="mr-1 flex items-center sm:mr-2">
                      <FaGraduationCap className="mr-1.5 text-xs md:text-sm text-[#EE6C4D]" /> 
                      <span className="text-[#3D5A80] dark:text-[#98C1D9]">Year of study:</span>
                    </span>
                    <b className="ml-1 text-[#293241] dark:text-[#E0FBFC]">{userData.yearOfStudy}</b>
                  </p>
                  
                  <p className="flex flex-wrap items-center justify-center md:justify-start">
                    <span className="mr-1 flex items-center sm:mr-2">
                      <FaBookReader className="mr-1.5 text-xs md:text-sm text-[#EE6C4D]" /> 
                      <span className="text-[#3D5A80] dark:text-[#98C1D9]">Department:</span>
                    </span>
                    <b className="ml-1 text-[#293241] dark:text-[#E0FBFC]">{userData.department}</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4">
              <CustomMoreButton />
              {(userData.canCreateEvents || userData.hasEventAccess)?
                <CustomEventDashboardButton />
                : ''
              }
              {(userData.canCreateCommittees || userData.hasCommitteeAccess)?
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
                  className={`${insetCls} mt-4 flex flex-col gap-5 overflow-hidden p-3 sm:p-6 lg:flex-row lg:gap-10`}
                >
                  <CustomContactInfo student={userData} />
                  <CustomAdditionalInfo student={userData} />
                </motion.div>
              )}
            </AnimatePresence>
            <section className="mt-8 border-t border-[#3D5A80]/15 pt-6 dark:border-[#98C1D9]/20" aria-labelledby="my-events-heading">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <SectionTitle id="my-events-heading">My Events</SectionTitle>
                </div>
                {!eventsLoading && registeredEvents.length > 0 && (
                  <span className="shrink-0 -rotate-3 rounded-md border border-[#98C1D9] bg-white/70 px-3 py-1 text-xs font-semibold text-[#3D5A80] dark:border-[#98C1D9]/30 dark:bg-[#293241]/50 dark:text-[#98C1D9]">
                    {registeredEvents.length} registered
                  </span>
                )}
              </div>

              {eventsLoading ? (
                <p className="mt-4 text-sm text-[#3D5A80] dark:text-[#98C1D9]">Loading your events...</p>
              ) : registeredEvents.length === 0 ? (
                <p className="mt-4 text-sm text-[#3D5A80] dark:text-[#98C1D9]">You have not registered for any events yet.</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {registeredEvents.map((event) => (
                    <article
                      key={event.id}
                      className="group relative overflow-hidden rounded-md border border-[#98C1D9] bg-white/75 p-4 shadow-[0_8px_20px_-14px_rgba(61,90,128,0.5)] transition duration-300 hover:-translate-y-0.5 hover:border-[#EE6C4D]/60 hover:bg-white dark:border-[#98C1D9]/25 dark:bg-[#293241]/55 dark:hover:bg-[#293241]/80"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-bold text-[#293241] transition-colors duration-200 group-hover:text-[#EE6C4D] dark:text-[#E0FBFC]">{event.name}</h4>
                          <p className="mt-1 text-xs text-[#3D5A80] dark:text-[#98C1D9]">{event.category}</p>
                        </div>
                        <span className="w-fit rounded-full border border-[#EE6C4D]/40 bg-[#EE6C4D]/10 px-3 py-1 text-xs font-semibold text-[#293241] dark:text-[#E0FBFC]">
                          {event.role}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-1 border-t border-[#3D5A80]/10 pt-3 text-sm text-[#293241] sm:grid-cols-2 dark:border-[#98C1D9]/15 dark:text-[#E0FBFC]">
                        <p>
                          <span className="text-[#3D5A80] dark:text-[#98C1D9]">When: </span>
                          {new Date(event.startsAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p>
                          <span className="text-[#3D5A80] dark:text-[#98C1D9]">Location: </span>{event.location}
                        </p>
                        {event.groupName && (
                          <p>
                            <span className="text-[#3D5A80] dark:text-[#98C1D9]">Group: </span>{event.groupName}
                          </p>
                        )}
                        {event.eventType !== "individual" && (
                          <p>
                            <span className="text-[#3D5A80] dark:text-[#98C1D9]">Participants: </span>{event.participantCount}
                          </p>
                        )}
                      </div>
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#EE6C4D] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {profileFileToCrop && (
        <ImageCropper
          file={profileFileToCrop}
          shape="circle"
          maxSizeMb={PROFILE_MAX_SIZE_MB}
          onComplete={(croppedFile) => {
            setProfileFileToCrop(null);
            void uploadProfileImage(croppedFile);
          }}
          onCancel={() => setProfileFileToCrop(null)}
        />
      )}

      <style>{`
        @keyframes pc-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes pc-fall {
          0% { transform: translate3d(0,-12vh,0) rotate(0deg); opacity: 0; }
          10% { opacity: .7; }
          90% { opacity: .7; }
          100% { transform: translate3d(var(--drift),112vh,0) rotate(var(--spin)); opacity: 0; }
        }
        .pc-rise { animation: pc-rise .8s cubic-bezier(.22,1,.36,1) both; }
        .pc-petal { animation: pc-fall linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pc-rise, .pc-petal { animation: none !important; }
          .pc-petal { display: none; }
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;