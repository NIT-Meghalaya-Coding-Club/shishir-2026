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
};


type AdditionalInfoProps = {
  student: UserData;
};

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ student }) => {
  return (
    <div className="backdrop-blur-md border-dashed border-4 border-white/10 shadow-2xl rounded-lg p-6">
      <h2 className="text-xl font-semibold text-teal-100 mb-4">
        Additional Information
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-50">
            Accommodation Required
          </p>
          <p className="mt-1">{student?.accommodation ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-50">Food Preference</p>
          <p className="mt-1">{student?.nonVeg ? "Non Veg" : "Veg"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-50">Emergency Contact</p>
          <p className="mt-1">{student?.emergencyContact}</p>
        </div>
      </div>
    </div>
  );
}

export default AdditionalInfo;
