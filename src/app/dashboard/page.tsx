import Image from "next/image";
import MoreButton from "@/components/dashboard/MoreButton";
import ContactInfo from "@/components/dashboard/ContactInfo";
import AdditionalInfo from "@/components/dashboard/AdditionalInfo";
import EditButton from "@/components/dashboard/EditButton";

type Student = {
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
  accommodationRequired: string;
  foodPreference: string;
  emergencyContact: string;
};

const student: Student = {
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
  accommodationRequired: "Yes",
  foodPreference: "VEG",
  emergencyContact: "Doraemon",
};

const ProfileCard = () => {
  return (
    <div>
      <div className="min-h-screen bg-teal-500 relative">
        <div className="bg-pink-600 h-[50vh]" style={{ backgroundImage: 'url("/background2.jpg")' }}></div>
        

        <div className="bg-white h-[50vh]" style={{ backgroundImage: 'url("/background2.jpg")'}} >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80" />
        </div>

        <div className="box absolute h-auto w-[90%] md:w-[55vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md border border-white/10 text-white p-6 rounded-lg shadow-lg">
          <div className="Name mt-32 text-center text-2xl md:text-4xl font-mono font-bold">
            {student.name}
          </div>
          <div className="Gender_DOB mt-1 text-center text-lg md:text-xl font-mono">
            {student.gender} - {student.dob}
          </div>
          <div className="college_info mt-10 text-center text-sm md:text-md font-mono">
            College : {student.college} <br />
            College ID : {student.collegeId} <br />
            Year of study : {student.yearOfStudy} <br />
            Department : {student.department}
          </div>
          <div className="more_button mt-10 flex justify-center">
            <MoreButton />
          </div>
        </div>

        <div className="circle absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[35vw] h-[35vw] md:w-[14vw] md:h-[14vw] flex items-center justify-center">
            <Image
              src={"/img/profile_img.jpg"}
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
        className="w-full border-t-2 border-double border-white bg-gradient-to-b from-[#331e12] to-[#141826]  p-6 md:p-10 text-center"
      > 
        <h2 className=" text-amber-50  md:text-3xl font-bold mt-8 md:mt-20">
          More Information
        </h2>
        <div className=" text-base flex-col p-10 space-y-10 md:text-lg text-amber-50">
          <ContactInfo student={student} />
          <AdditionalInfo student={student} />
        </div>  
        <div className="flex justify-center mt-4">
          <EditButton />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
