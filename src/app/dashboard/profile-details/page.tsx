"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Crown, Pencil } from "lucide-react";

import NeonCursorBackground from "@/components/NeonCursorBackground";
import ImageCropper, { MAX_IMAGE_SIZE_MB } from "@/components/ImageCropper";

const NIT_COLLEGE = "National Institute of Technology, Meghalaya";
const COLLEGE_ID_PATTERN = /[A-Za-z]\d{2}[A-Za-z]{2}\d{3}/;
const DEPARTMENT_SUGGESTIONS = [
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics and Communications Engineering",
  "Computer Science Engineering",
  "Chemical & Biological Sciences",
  "Humanities & Social Sciences",
  "Mathematics",
  "Physics",
];

function collegeIdFromEmail(email: string) {
  return email.split("@")[0].match(COLLEGE_ID_PATTERN)?.[0].toLowerCase() || "";
}

function isNITEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@nitm.ac.in");
}

const ProfileDetailsForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCollegeEmailDialog, setShowCollegeEmailDialog] = useState(false);
  const [otherCollege, setOtherCollege] = useState("");
  const [showOtherCollege, setShowOtherCollege] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileFileToCrop, setProfileFileToCrop] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [departmentFocused, setDepartmentFocused] = useState(false);

  const getProfileImageUrl = (image: string) => {
    if (!image || image.startsWith("/api/uploads/profile/")) return image;

    try {
      const url = new URL(image);
      const key = url.pathname.replace(/^\//, "");
      return key.startsWith("profiles/") ? `/api/uploads/profile/${key}` : image;
    } catch {
      return image;
    }
  };

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
            data.user.college !== NIT_COLLEGE;

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
            image: getProfileImageUrl(data.user?.image || session.user?.image || ""),
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
      const value = (
        e.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
      ).value;
      const invalidNITSelection =
        name === "college" &&
        value === NIT_COLLEGE &&
        !isNITEmail(session?.user?.email || formData.email);
      setFormData((prev) => ({
        ...prev,
        [name]: invalidNITSelection ? "" : value,
        ...(invalidNITSelection ? { collegeID: "" } : {}),
      }));

      // Special handling for college dropdown
      if (name === "college") {
        setShowOtherCollege(value === "Other");
        if (invalidNITSelection) {
          setShowCollegeEmailDialog(true);
        }
        if (value !== "Other") {
          setOtherCollege("");
        }
      }
    }
  };

  useEffect(() => {
    if (formData.college !== NIT_COLLEGE) return;

    if (!isNITEmail(formData.email || session?.user?.email || "")) {
      setShowCollegeEmailDialog(true);
      setFormData((previous) => ({ ...previous, college: "", collegeID: "" }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      collegeID: collegeIdFromEmail(previous.email || session?.user?.email || "").toUpperCase(),
    }));
  }, [formData.college, formData.email, session?.user?.email]);

  const handleOtherCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherCollege(e.target.value);
  };

  const filteredDepartmentSuggestions = DEPARTMENT_SUGGESTIONS.filter((department) =>
    department.toLowerCase().includes(formData.dept.trim().toLowerCase())
  );

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      alert("Profile picture must be a JPEG, PNG, or WebP image");
      return;
    }

    setProfileFileToCrop(file);
  };

  useEffect(() => {
    if (!profileFile) {
      setProfilePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(profileFile);
    setProfilePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [profileFile]);

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

    let profileImage = formData.image;

    const submissionData = {
      ...formData,
      email: session?.user?.email || formData.email,
      college: formData.college === "Other" ? otherCollege : formData.college,
    };

    try {
      if (profileFile) {
        const presignResponse = await fetch("/api/uploads/profile/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: profileFile.type,
            fileSize: profileFile.size,
          }),
        });
        const presignData = await presignResponse.json();

        if (!presignResponse.ok) {
          alert(presignData.message || "Could not prepare profile picture upload");
          return;
        }

        const uploadResponse = await fetch(presignData.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": profileFile.type },
          body: profileFile,
        });

        if (!uploadResponse.ok) {
          alert("Could not upload profile picture");
          return;
        }

        profileImage = presignData.publicUrl;
      }

      const res = await fetch(`/api/user/update/${formData.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submissionData, image: profileImage }),
      });

      if (res.ok) {
        setFormData((previous) => ({ ...previous, image: profileImage }));
        setProfileFile(null);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 py-10 relative">
      {/* Fixed position for background to cover entire screen */}
      <div className="fixed inset-0">
        <NeonCursorBackground />
      </div>

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-2xl border border-amber-500 border-opacity-20 z-10 mt-16">
        <div className="relative flex justify-center items-center gap-4 mb-6">
          <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-4 md:pt-10">
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
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="profilePicture" className="text-yellow-300">
                Profile Picture
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative h-20 w-20">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Selected profile preview"
                      className="h-20 w-20 rounded-full object-cover border border-yellow-500/50"
                    />
                  ) : formData.image ? (
                    <img
                      src={formData.image}
                      alt="Current profile"
                      className="h-20 w-20 rounded-full object-cover border border-yellow-500/50"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border border-yellow-500/50 bg-gray-700" />
                  )}
                  <label
                    htmlFor="profilePicture"
                    title="Change profile picture"
                    className="absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-800 bg-yellow-500 text-black shadow-lg transition-transform hover:scale-110"
                  >
                    <Pencil size={15} aria-hidden="true" />
                    <span className="sr-only">Change profile picture</span>
                  </label>
                </div>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfileFileChange}
                  className="sr-only"
                />
                <span className="text-sm text-yellow-100/80">Click the pencil to change your picture.</span>
              </div>
              <p className="text-xs text-yellow-100/70">JPEG, PNG, or WebP up to 5 MB.</p>
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
                <option value={NIT_COLLEGE}>
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
                readOnly={formData.college === NIT_COLLEGE}
                className="input-style"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="yearOfStudy" className="text-yellow-300">
                Year of Study
              </label>
              <div className="flex items-center justify-between rounded-md border border-yellow-500 bg-gray-700 px-2 py-1">
                <button
                  type="button"
                  aria-label="Decrease year of study"
                  disabled={Number(formData.yearOfStudy || 1) <= 1}
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      yearOfStudy: String(Math.max(1, Number(previous.yearOfStudy || 1) - 1)),
                    }))
                  }
                  className="h-10 w-10 rounded-md text-2xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>
                <span
                  id="yearOfStudy"
                  aria-live="polite"
                  className="min-w-12 text-center text-lg font-semibold text-white"
                >
                  {formData.yearOfStudy || "1"}
                </span>
                <button
                  type="button"
                  aria-label="Increase year of study"
                  disabled={Number(formData.yearOfStudy || 1) >= 5}
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      yearOfStudy: String(Math.min(5, Number(previous.yearOfStudy || 1) + 1)),
                    }))
                  }
                  className="h-10 w-10 rounded-md text-2xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="dept" className="text-yellow-300">
                Department
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="dept"
                  placeholder="Eg: Mechanical Engineering"
                  value={formData.dept}
                  onChange={handleChange}
                  onFocus={() => setDepartmentFocused(true)}
                  onBlur={() => setDepartmentFocused(false)}
                  className="input-style"
                  required
                />
                {departmentFocused && filteredDepartmentSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-yellow-500/50 bg-gray-900 p-1 shadow-xl">
                    {filteredDepartmentSuggestions.map((department) => (
                      <button
                        key={department}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setFormData((previous) => ({ ...previous, dept: department }));
                          setDepartmentFocused(false);
                        }}
                        className="block w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-yellow-500/20"
                      >
                        {department}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
      {showCollegeEmailDialog && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="college-email-dialog-title"
            className="w-full max-w-md rounded-lg border border-yellow-500/50 bg-gray-900 p-6 text-center shadow-2xl"
          >
            <h2 id="college-email-dialog-title" className="text-2xl font-semibold text-yellow-400">
              Please use your college email
            </h2>
            <p className="mt-3 text-white">
              National Institute of Technology, Meghalaya requires an email ending with @nitm.ac.in.
            </p>
            <button
              type="button"
              className="mt-5 rounded bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-400"
              onClick={() => setShowCollegeEmailDialog(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {profileFileToCrop && (
        <ImageCropper
          file={profileFileToCrop}
          shape="circle"
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onComplete={(croppedFile) => {
            setProfileFileToCrop(null);
            setProfileFile(croppedFile);
          }}
          onCancel={() => setProfileFileToCrop(null)}
        />
      )}

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
