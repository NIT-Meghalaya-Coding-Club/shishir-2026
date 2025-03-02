"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Crown } from "lucide-react";

import NeonCursorBackground from "@/components/NeonCursorBackground";

const ProfileDetailsForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otherCollege, setOtherCollege] = useState("");
  const [showOtherCollege, setShowOtherCollege] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    college: "",
    collegeID: "",
    yearOfStudy: "",
    dept: "",
    email: "",
    phone: "",
    alternateNumber: "",
    accommodation: false,
    nonVeg: false,
    emergencyContact: "",
    image: "",
    registered: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email || dataFetched) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/user/get-info/${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          const isOtherCollege =
            data.user?.college &&
            data.user.college !== "National Institute of Technology, Meghalaya";

          setShowOtherCollege(isOtherCollege);
          if (isOtherCollege) {
            setOtherCollege(data.user?.college || "");
          }

          setFormData({
            name: data.user?.name || "",
            gender: data.user?.gender || "",
            dob: data.user?.dob || "",
            college: isOtherCollege ? "Other" : data.user?.college || "",
            collegeID: data.user?.collegeID || "",
            yearOfStudy: data.user?.yearOfStudy || "",
            dept: data.user?.dept || "",
            email: data.user?.email || "",
            phone: data.user?.phone || "",
            alternateNumber: data.user?.alternateNumber || "",
            accommodation: data.user?.accommodation || false,
            nonVeg: data.user?.nonVeg || false,
            emergencyContact: data.user?.emergencyContact || "",
            image: data.user?.image || "",
            registered: data.user?.registered || false,
          });

          setDataFetched(true);

          if (data.user?.registered) {
            setTimeout(() => setShowModal(true), 1000);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, dataFetched]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: (
          e.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
        ).value,
      }));

      // Special handling for college dropdown
      if (name === "college") {
        const value = (e.target as HTMLSelectElement).value;
        setShowOtherCollege(value === "Other");
        if (value !== "Other") {
          setOtherCollege("");
        }
      }
    }
  };

  const handleOtherCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherCollege(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const requiredFields = [
      "name",
      "gender",
      "dob",
      "college",
      "collegeID",
      "yearOfStudy",
      "dept",
      "email",
      "phone",
      "emergencyContact",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(", ")}`);
      setSaving(false);
      return;
    }

    const submissionData = {
      ...formData,
      email: session?.user?.email || formData.email,
      college: formData.college === "Other" ? otherCollege : formData.college,
    };

    try {
      const res = await fetch(`/api/user/update/${formData.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        setShowModal(true);
      } else {
        alert("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-white">
        <NeonCursorBackground />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-20 relative">
      {/* Fixed position for background to cover entire screen */}
      <div className="fixed inset-0">
        <NeonCursorBackground />
      </div>

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-2xl border border-amber-500 border-opacity-20 z-50">
        <div className="relative flex justify-center items-center gap-4 mb-6">
          <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-10">
            REGISTER
          </h1>
          <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          <div className="absolute -bottom-2 h-1 w-48 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label htmlFor="name" className="text-yellow-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-yellow-300">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-style"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dob" className="text-yellow-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="college" className="text-yellow-300">
                College Name
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="input-style"
                required
              >
                <option value="">Select College</option>
                <option value="National Institute of Technology, Meghalaya">
                  National Institute of Technology, Meghalaya
                </option>
                <option value="Other">Other</option>
              </select>
              {showOtherCollege && (
                <input
                  type="text"
                  placeholder="Enter your college name"
                  value={otherCollege}
                  onChange={handleOtherCollegeChange}
                  className="input-style mt-2"
                  required={formData.college === "Other"}
                />
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="collegeID" className="text-yellow-300">
                College ID
              </label>
              <input
                type="text"
                name="collegeID"
                placeholder="Eg: B22CS0XX"
                value={formData.collegeID}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="yearOfStudy" className="text-yellow-300">
                Year of Study
              </label>
              <input
                type="text"
                name="yearOfStudy"
                placeholder="Eg: 3"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dept" className="text-yellow-300">
                Course and Department
              </label>
              <input
                type="text"
                name="dept"
                placeholder="Eg: Mechanical Engineering"
                value={formData.dept}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-yellow-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={session?.user?.email || formData.email}
                className="input-style cursor-not-allowed opacity-70"
                readOnly
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-yellow-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="alternateNumber" className="text-yellow-300">
                Alternate Number
              </label>
              <input
                type="tel"
                name="alternateNumber"
                placeholder="Alternate Number"
                value={formData.alternateNumber}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:space-x-4 pt-10 text-yellow-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="accommodation"
                checked={formData.accommodation}
                onChange={handleChange}
                className="accent-yellow-500 "
              />
              <span>Need Accommodation?</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="nonVeg"
                checked={formData.nonVeg}
                onChange={handleChange}
                className="accent-yellow-500"
              />
              <span>Non-Veg?</span>
            </label>
          </div>

          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="input-style"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:scale-[101%] transition-transform"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-2xl font-semibold text-yellow-400">
              Profile Updated!
            </h2>
            <p className="mt-2 text-white">
              Your profile has been successfully updated.
            </p>
            <button
              className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:scale-105 transition-all duration-150"
              onClick={() => {
                setShowModal(false);
                router.push("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetailsForm;
