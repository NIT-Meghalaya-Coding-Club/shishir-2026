"use client";

import Image from "next/image";
import MoreButton from "@/components/dashboard/MoreButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import ContactInfo from "@/components/dashboard/ContactInfo";
import AdditionalInfo from "@/components/dashboard/AdditionalInfo";
import EditButton from "@/components/dashboard/EditButton";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
};

const ProfileCard = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "Nobita Nobi",
    gender: "Male",
    dob: "30 / 07 / 2004",
    college: "National Institute of Technology, Meghalaya",
    collegeId: "B23CS0XX",
    yearOfStudy: "II",
    department: "CSE",
    email: "nobitanobi@yahoo.com",
    phoneNumber: "1234567890",
    alternateNumber: "2337347409",
    accommodation: true,
    nonVeg: false,
    emergencyContact: "Doraemon",
    image: ""
  });

  const { data: session, status } = useSession();
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            image: data.user?.image || ""
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

  return (
    <div>
      <div className="min-h-screen wrapper h-fit relative">
        {isLoading && <Loading />}
        <div className="box absolute h-auto w-[90%] md:w-[55vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 border border-yellow-400/20 text-white p-6 rounded-lg shadow-lg">
          <div className="Name mt-32 text-center text-2xl md:text-4xl font-mono font-bold">
            {userData.name}
          </div>
          <div className="Gender_DOB mt-1 text-center text-lg md:text-xl font-mono">
            {userData.gender} - {userData.dob}
          </div>
          <div className="college_info mt-10 text-center text-sm md:text-md font-mono">
            College : {userData.college} <br />
            College ID : {userData.collegeId} <br />
            Year of study : {userData.yearOfStudy} <br />
            Department : {userData.department}
          </div>
          <div className="more_button mt-10 flex justify-center gap-5">
            <MoreButton />
            <LogoutButton />
          </div>
        </div>

        <div className="circle absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[35vw] h-[35vw] md:w-[14vw] md:h-[14vw] flex items-center justify-center">
            <Image
              src={userData.image !== "" ? userData.image : "/assets/profile-icon.svg"}
              alt="Profile"
              width={96}
              height={96}
              className="w-[25vw] h-[25vw] md:w-[10vw] md:h-[10vw] rounded-full shadow-xl object-cover absolute"
            />
            <Image
              src={"/img/frame_new.webp"}
              alt="Profile Frame"
              width={196}
              height={196}
              className="w-[30vw] h-[30vw] md:w-full md:h-full rounded-full object-cover absolute animate-spin-slow"
            />
          </div>
        </div>
      </div>
      <div
        id="more-info-section"
        className="w-full border-t-2 border-double border-white bg-gradient-to-b from-[#331e12] to-[#141826] p-6 md:p-10 text-center"
      >
        <h2 className="text-amber-50 md:text-3xl font-bold mt-8 md:mt-20">
          More Information
        </h2>
        <div className="text-base flex-col p-10 space-y-10 md:text-lg text-amber-50">
          <ContactInfo student={userData} />
          <AdditionalInfo student={userData} />
        </div>
        <div className="flex justify-center mt-4">
          <EditButton />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
