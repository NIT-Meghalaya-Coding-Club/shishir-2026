"use client"

import Dropdown from "@/components/register-form/Dropdown";
import InputBox from "@/components/register-form/InputBox";
import { useState } from "react";

interface FormDetailsType {
  fullName: string;
  gender: string;
  dob: string;
  collegeId: string;
  collegeName: string;
  yearOfStudy: string;
  department: string;
  email: string;
  phoneNumber: string;
  alternateContactNumber?: string;
  // eventsRegisteredFor?: string;
  // teamName?: string;
  // teamMembers?: string;
  // paymentStatus?: string;
  // accommodationRequired?: string;
  // foodPreferences?: string;
  // emergencyContactDetails?: string;
}

const RegisterForm: React.FC = () => {
  const [formDetails, setFormDetails] = useState<FormDetailsType>({
    fullName: '',
    gender: '',
    dob: '',
    collegeId: '',
    collegeName: '',
    yearOfStudy: '',
    department: '',
    email: '',
    phoneNumber: '',
    alternateContactNumber: ''
    // eventsRegisteredFor: '',
    // teamName: '',
    // teamMembers: '',
    // paymentStatus: '',
    // accommodationRequired: '',
    // foodPreferences: '',
    // emergencyContactDetails: ''
  });
    return (
        <div className="h-full pt-20 py-10 grid place-content-center bg-gray-800 text-white">
            <form className="w-full p-10 bg-gray-900 rounded-lg shadow-lg flex flex-col space-y-5">
                <h1 className="text-5xl font-bold text-center mb-5">Register</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Basic Details */}
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, fullName: e.target.value })
                    }
                    title="Full Name"
                    type="text"
                  />
                  <Dropdown
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, gender: e.target.value })
                    }
                    title="Gender"
                    options={["--SELECT--", "Male", "Female", "Other"]}
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, dob: e.target.value })
                    }
                    title="Date of Birth"
                    type="date"
                  />
                  {/* College and Academic info */}
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, collegeId: e.target.value })
                    }
                    title="College ID/Enrollment Number"
                    type="text"
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, collegeName: e.target.value })
                    }
                    title="College Name"
                    type="text"
                  />
                  <Dropdown
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, yearOfStudy: e.target.value })
                    }
                    title="Year of Study"
                    options={[
                      "--SELECT--","1st Year","2nd Year","3rd Year","4th Year","5th Year",
                    ]}
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, department: e.target.value })
                    }
                    title="Department/Branch"
                    type="text"
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, email: e.target.value })
                    }
                    title="Email Address"
                    type="email"
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, phoneNumber: e.target.value })
                    }
                    title="Phone Number"
                    type="tel"
                  />
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        alternateContactNumber: e.target.value,
                      })
                    }
                    title="Alternate Contact Number"
                    type="tel"
                    required={false}
                  />
                  {/* <InputBox onChange={
                          (e) => setFormDetails({ ...formDetails, eventsRegisteredFor: e.target.value })
                          } title="Events Registered For" type="text" />
                          <InputBox onChange={
                          (e) => setFormDetails({ ...formDetails, teamName: e.target.value })
                          } title="Team Name" type="text" />
                          <InputBox onChange={
                          (e) => setFormDetails({ ...formDetails, teamMembers: e.target.value })
                          } title="Team Members" type="text" />
                          <Dropdown onChange={
                          (e) => setFormDetails({ ...formDetails, paymentStatus: e.target.value })
                          } title="Payment Status" options={['Paid', 'Pending']} /> */}
                  {/* Additional Info */}
                  {/* <Dropdown onChange={
                            (e) => setFormDetails({ ...formDetails, accommodationRequired: e.target.value })
                          } title="Accommodation Required?" options={['Yes', 'No']} />
                          <Dropdown onChange={
                            (e) => setFormDetails({ ...formDetails, foodPreferences: e.target.value })
                          } title="Food Preferences" options={['Veg', 'Non-Veg']} />
                          <InputBox onChange={
                            (e) => setFormDetails({ ...formDetails, emergencyContactDetails: e.target.value })
                          } title="Emergency Contact Details" type="text" /> */}
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Register</button>
            </form>
            
        </div>
    );
}

export default RegisterForm;