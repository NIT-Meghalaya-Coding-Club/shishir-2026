"use client"

import InputBox from "@/components/register-form/InputBox";
import { useState } from "react";
import NeonCursorBackground from '@/components/NeonCursorBackground';
import { Crown } from "lucide-react";
import Dropdown from "@/components/register-form/Dropdown";

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
        <div className="bg-[#202551] flex justify-center relative min-h-screen w-full h-fit">
      <NeonCursorBackground/>
            <form className="relative w-4/5 xl:w-1/2 p-10 mt-10 backdrop-blur-md rounded-lg shadow-2xl flex flex-col space-y-5">
                <div className="relative flex justify-center items-center gap-4 mb-6">
                <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-10">
                  REGISTER
                </h1>
                <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
              <div className="absolute -bottom-2 h-1 w-48 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
            </div>
                <div className="grid text-whitegrid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Basic Details */}
                  <InputBox
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, fullName: e.target.value })
                    }
                    title="Full Name"
                    type="text"
                  />
                  <Dropdown
                    onChange={(value) =>
                      setFormDetails({ ...formDetails, gender: value })
                    }
                    title="Gender"
                    options={["Male", "Female"]}
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
                  <Dropdown
                    onChange={(value) =>
                      setFormDetails({ ...formDetails, collegeName: value })
                    }
                    title="College Name"
                    options={["NIT Meghalaya"]}
                  />
                  <Dropdown
                    onChange={(value) =>
                      setFormDetails({ ...formDetails, yearOfStudy: value })
                    }
                    title="Year of Study"
                    options={[
                      "1st Year","2nd Year","3rd Year","4th Year",
                    ]}
                  />
                  <Dropdown
                    onChange={(value) =>
                      setFormDetails({ ...formDetails, department: value })
                    }
                    title="Department/Branch"
                    options={[
                      "CSE","ECE","EE","ME","CE"
                    ]}
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
                <div className="flex justify-center">
                    <button className="p-3 w-1/2 xl:w-1/4 text-lg font-mono font-semibold text-gray-700 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md shadow-2xl transition-all duration-200
                      hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-inner focus:outline-none" type="submit">Register</button>
                </div>
            </form>
    </div>
    );
}

export default RegisterForm;