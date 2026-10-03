"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";

// import NeonCursorBackground from "@/components/NeonCursorBackground";
import ImageCropper, { MAX_IMAGE_SIZE_MB } from "@/components/ImageCropper";
import ValidationDialog from "@/components/ui/ValidationDialog";
import {
  NIT_COLLEGE,
  ProfileSchema,
  collegeIdFromEmail,
  isNITEmail,
} from "@/lib/validation/profileSchema";

/* ──────────────────────────────────────────────────────────────
   Palette
   Dusk Blue #3D5A80 · Powder Blue #98C1D9 · Burnt Peach #EE6C4D
   Light Cyan #E0FBFC · Jet Black #293241
   ────────────────────────────────────────────────────────────── */

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

/* ─── Presentation helpers (no logic) ─────────────────────────── */

const PETAL_COLORS = ["#F9C9C4", "#F4A9A0", "#EE6C4D", "#FBDDD9", "#F6B7B0"];

const paperGrain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const inputCls =
  "w-full rounded-md border border-[#98C1D9] bg-white/80 px-3.5 py-2.5 text-[#293241] placeholder:text-[#3D5A80]/45 shadow-[inset_0_1px_2px_rgba(61,90,128,0.08)] outline-none transition duration-200 hover:border-[#3D5A80]/60 focus:border-[#EE6C4D] focus:bg-white focus:ring-2 focus:ring-[#EE6C4D]/25 read-only:bg-[#E0FBFC]/70 dark:bg-[#293241]/70 dark:border-[#98C1D9]/35 dark:text-[#E0FBFC] dark:placeholder:text-[#98C1D9]/50 dark:hover:border-[#98C1D9]/70 dark:focus:bg-[#293241] dark:read-only:bg-[#3D5A80]/30 dark:[color-scheme:dark]";

const labelCls =
  "block text-sm font-semibold text-[#3D5A80] dark:text-[#98C1D9]";

const paperCls =
  "bg-gradient-to-br from-white via-[#F3FCFC] to-[#DDF1F5] dark:from-[#3b4d6b] dark:via-[#33435e] dark:to-[#2c3a52]";

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Blossom className="w-4 h-4 text-[#EE6C4D] shrink-0" />
      <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
        {children}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-[#98C1D9] to-transparent" />
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  );
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
  const [validationMessage, setValidationMessage] = useState("");

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

    const validationResult = ProfileSchema.safeParse({
      ...formData,
      email: session?.user?.email || formData.email,
      otherCollege,
    });
    if (!validationResult.success) {
      setValidationMessage(validationResult.error.issues.map((issue) => issue.message).join("\n"));
      setSaving(false);
      return;
    }

    setSaving(true);

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

  /* Shared animation + decoration CSS (presentation only) */
  const styles = (
    <style>{`
      @keyframes reg-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
      @keyframes reg-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes reg-pop { from { opacity: 0; transform: scale(.92) translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes reg-fall {
        0% { transform: translate3d(0,-12vh,0) rotate(0deg); opacity: 0; }
        10% { opacity: .75; }
        90% { opacity: .75; }
        100% { transform: translate3d(var(--drift),112vh,0) rotate(var(--spin)); opacity: 0; }
      }
      @keyframes reg-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      @keyframes reg-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
      @keyframes reg-bloom { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
      @keyframes reg-spin { to { transform: rotate(360deg); } }
      .reg-rise { animation: reg-rise .8s cubic-bezier(.22,1,.36,1) both; }
      .reg-fade { animation: reg-fade .35s ease both; }
      .reg-pop { animation: reg-pop .45s cubic-bezier(.22,1,.36,1) both; }
      .reg-petal { animation: reg-fall linear infinite; }
      .reg-float { animation: reg-float 3.2s ease-in-out infinite; }
      .reg-spin { animation: reg-spin 2.4s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .reg-rise, .reg-fade, .reg-pop, .reg-petal, .reg-float, .reg-spin,
        .reg-branch, .reg-bloom { animation: none !important; }
        .reg-petal { display: none; }
      }
    `}</style>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#E0FBFC] dark:bg-[#293241]">
        {styles}
        <Blossom className="reg-spin w-10 h-10 text-[#EE6C4D]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 py-10 relative">
      {styles}
      <ValidationDialog
        open={Boolean(validationMessage)}
        message={validationMessage}
        onClose={() => setValidationMessage("")}
      />

      {/* Fixed backdrop: Light Cyan wash, soft glows and drifting petals */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#E0FBFC] dark:bg-[#293241] pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full blur-3xl bg-[#98C1D9]/40 dark:bg-[#3D5A80]/40" />
        <div className="absolute -bottom-32 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl bg-[#EE6C4D]/15 dark:bg-[#EE6C4D]/10" />
        {Array.from({ length: 12 }).map((_, i) => {
          const size = 9 + (i % 4) * 3;
          return (
            <span
              key={i}
              className="reg-petal absolute top-0"
              style={
                {
                  left: `${(i * 8.3 + 3) % 100}%`,
                  width: size,
                  height: size * 1.25,
                  background: PETAL_COLORS[i % PETAL_COLORS.length],
                  borderRadius: "100% 0 100% 0",
                  animationDuration: `${14 + ((i * 5) % 9)}s`,
                  animationDelay: `-${(i * 3.1) % 16}s`,
                  "--drift": `${(i % 2 ? 1 : -1) * (60 + ((i * 29) % 140))}px`,
                  "--spin": `${(i % 2 ? 1 : -1) * (240 + ((i * 41) % 300))}deg`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-2xl mt-28 reg-rise">
        {/* Swan crest, overlapping the top edge of the paper */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
          <div className="reg-float relative">
            <div className="absolute -inset-5 rounded-full blur-xl bg-[radial-gradient(circle,rgba(152,193,217,0.7),rgba(238,108,77,0.15)_60%,transparent_72%)]" />
            <div className="relative w-24 h-24 rounded-full bg-white dark:bg-[#293241] border-[3px] border-[#98C1D9] dark:border-[#3D5A80] shadow-[0_14px_30px_-10px_rgba(61,90,128,0.55)] flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="SHISHIR swan crest"
                width={80}
                height={80}
                priority
                className="w-16 h-16 object-contain select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* The paper */}
        <div
          className={`relative overflow-hidden rounded-[3px] border-y-[6px] border-[#3D5A80] dark:border-[#98C1D9] shadow-[0_28px_70px_-20px_rgba(61,90,128,0.55),0_0_0_1px_rgba(152,193,217,0.5)] ${paperCls}`}
        >
          <div
            className="absolute inset-0 opacity-70 dark:opacity-40 mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: paperGrain }}
          />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />

          {/* Blossom branch that draws itself in the corner */}
          <svg
            viewBox="0 0 140 120"
            className="hidden sm:block absolute top-2 right-2 w-32 md:w-36 opacity-45 pointer-events-none"
            aria-hidden="true"
          >
            <path
              className="reg-branch"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                animation: "reg-draw 1.6s .6s ease-in-out both",
              }}
              d="M138 8 C112 16 94 38 66 52 S28 82 6 104 M94 38 C98 52 90 62 80 70 M66 52 C60 38 50 32 40 30"
              fill="none"
              stroke="#293241"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[
              [112, 17, "#F4A9A0"],
              [94, 38, "#EE6C4D"],
              [80, 70, "#F9C9C4"],
              [66, 52, "#F4A9A0"],
              [40, 30, "#F9C9C4"],
              [28, 82, "#EE6C4D"],
            ].map(([cx, cy, fill], i) => (
              <g
                key={i}
                className="reg-bloom"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animation: `reg-bloom .5s ${1.1 + i * 0.12}s cubic-bezier(.34,1.56,.64,1) both`,
                }}
              >
                <circle cx={cx as number} cy={cy as number} r="7" fill={fill as string} opacity="0.9" />
                <circle cx={cx as number} cy={cy as number} r="2" fill="#FFF4E0" />
              </g>
            ))}
          </svg>

          {/* Inner framed writing area */}
          <div className="relative z-10 m-2 sm:m-3 rounded-[2px] border border-[#3D5A80]/20 dark:border-[#98C1D9]/30 px-5 sm:px-9 pt-16 pb-8">
            {/* Header */}
            <div className="reg-rise text-center mb-9" style={{ animationDelay: ".1s" }}>
              <div className="flex items-center justify-center gap-4">
                <Blossom className="w-5 h-5 text-[#F4A9A0]" />
                <h1 className="font-[900] text-4xl sm:text-5xl tracking-tight text-[#EE6C4D] drop-shadow-[0_4px_20px_rgba(238,108,77,0.25)]">
                  REGISTER
                </h1>
                <Blossom className="w-5 h-5 text-[#F4A9A0]" />
              </div>
              <p className="mt-2 text-sm text-[#3D5A80] dark:text-[#98C1D9]">
                Complete your profile to take part in Shishir.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#98C1D9]" />
                <Blossom className="w-3.5 h-3.5 text-[#EE6C4D]" />
                <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#98C1D9]" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-9">
              {/* ─── Personal ─── */}
              <section className="reg-rise" style={{ animationDelay: ".25s" }}>
                <SectionTitle>Personal details</SectionTitle>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Full Name" htmlFor="name">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputCls}
                      required
                    />
                  </Field>

                  <Field label="Gender" htmlFor="gender">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Date of Birth" htmlFor="dob">
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={inputCls}
                      required
                    />
                  </Field>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="profilePicture" className={labelCls}>
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative h-[88px] w-[88px] shrink-0">
                        <div className="h-full w-full rounded-full p-[3px] bg-gradient-to-tr from-[#EE6C4D] via-[#F6B7B0] to-[#98C1D9] shadow-[0_8px_20px_-8px_rgba(61,90,128,0.6)]">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Selected profile preview"
                              className="h-full w-full rounded-full object-cover border-2 border-white dark:border-[#293241]"
                            />
                          ) : formData.image ? (
                            <img
                              src={formData.image}
                              alt="Current profile"
                              className="h-full w-full rounded-full object-cover border-2 border-white dark:border-[#293241]"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full border-2 border-white dark:border-[#293241] bg-[#E0FBFC] dark:bg-[#3D5A80]" />
                          )}
                        </div>
                        <label
                          htmlFor="profilePicture"
                          title="Change profile picture"
                          className="absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white dark:border-[#293241] bg-[#EE6C4D] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:rotate-6"
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
                      <div className="space-y-0.5">
                        <span className="block text-sm text-[#293241] dark:text-[#E0FBFC]">
                          Use Pencil Icon to edit the profile photo.
                        </span>
                        <p className="text-xs text-[#3D5A80]/80 dark:text-[#98C1D9]/80">
                          JPEG, PNG, or WebP up to 5 MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ─── College ─── */}
              <section className="reg-rise" style={{ animationDelay: ".35s" }}>
                <SectionTitle>College</SectionTitle>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="College Name" htmlFor="college">
                    <select
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className={inputCls}
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
                        className={`${inputCls} mt-2`}
                        required={formData.college === "Other"}
                      />
                    )}
                  </Field>

                  <Field label="College ID" htmlFor="collegeID">
                    <input
                      id="collegeID"
                      type="text"
                      name="collegeID"
                      placeholder="Eg: B22CS0XX"
                      value={formData.collegeID}
                      onChange={handleChange}
                      readOnly={formData.college === NIT_COLLEGE}
                      className={inputCls}
                      required
                    />
                  </Field>

                  <Field label="Year of Study" htmlFor="yearOfStudy">
                    <div className="flex items-center justify-between rounded-md border border-[#98C1D9] bg-white/80 dark:bg-[#293241]/70 dark:border-[#98C1D9]/35 px-1.5 py-1 shadow-[inset_0_1px_2px_rgba(61,90,128,0.08)]">
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
                        className="h-9 w-9 rounded-md text-2xl leading-none text-[#3D5A80] dark:text-[#98C1D9] transition hover:bg-[#EE6C4D]/10 hover:text-[#EE6C4D] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#3D5A80]"
                      >
                        -
                      </button>
                      <span
                        id="yearOfStudy"
                        aria-live="polite"
                        className="min-w-12 text-center text-lg font-bold text-[#293241] dark:text-[#E0FBFC]"
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
                        className="h-9 w-9 rounded-md text-2xl leading-none text-[#3D5A80] dark:text-[#98C1D9] transition hover:bg-[#EE6C4D]/10 hover:text-[#EE6C4D] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#3D5A80]"
                      >
                        +
                      </button>
                    </div>
                  </Field>

                  <Field label="Department" htmlFor="dept">
                    <div className="relative">
                      <input
                        id="dept"
                        type="text"
                        name="dept"
                        placeholder="Eg: Mechanical Engineering"
                        value={formData.dept}
                        onChange={handleChange}
                        onFocus={() => setDepartmentFocused(true)}
                        onBlur={() => setDepartmentFocused(false)}
                        className={inputCls}
                        required
                      />
                      {departmentFocused && filteredDepartmentSuggestions.length > 0 && (
                        <div className="reg-fade absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 overflow-y-auto rounded-md border border-[#98C1D9] bg-white dark:bg-[#293241] dark:border-[#98C1D9]/40 p-1 shadow-[0_18px_40px_-12px_rgba(41,50,65,0.45)]">
                          {filteredDepartmentSuggestions.map((department) => (
                            <button
                              key={department}
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                setFormData((previous) => ({ ...previous, dept: department }));
                                setDepartmentFocused(false);
                              }}
                              className="block w-full rounded px-3 py-2 text-left text-sm text-[#293241] dark:text-[#E0FBFC] transition hover:bg-[#EE6C4D]/10 hover:text-[#EE6C4D]"
                            >
                              {department}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>
              </section>

              {/* ─── Contact ─── */}
              <section className="reg-rise" style={{ animationDelay: ".45s" }}>
                <SectionTitle>Contact</SectionTitle>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Email" htmlFor="email">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={session?.user?.email || formData.email}
                      className={`${inputCls} cursor-not-allowed opacity-70`}
                      readOnly
                      required
                    />
                  </Field>

                  <Field label="Phone Number" htmlFor="phone">
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputCls}
                      required
                    />
                  </Field>

                  <Field label="Alternate Number" htmlFor="alternateNumber">
                    <input
                      id="alternateNumber"
                      type="tel"
                      name="alternateNumber"
                      placeholder="Alternate Number"
                      value={formData.alternateNumber}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Emergency Contact" htmlFor="emergencyContact">
                    <input
                      id="emergencyContact"
                      type="text"
                      name="emergencyContact"
                      placeholder="Emergency Contact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className={inputCls}
                      required
                    />
                  </Field>
                </div>
              </section>

              {/* ─── Preferences ─── */}
              <section className="reg-rise" style={{ animationDelay: ".55s" }}>
                <SectionTitle>Preferences</SectionTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border border-[#98C1D9] bg-white/60 dark:bg-[#293241]/50 dark:border-[#98C1D9]/35 px-4 py-3 text-[#293241] dark:text-[#E0FBFC] transition hover:border-[#EE6C4D] has-[:checked]:border-[#EE6C4D] has-[:checked]:bg-[#EE6C4D]/10">
                    <input
                      type="checkbox"
                      name="accommodation"
                      checked={formData.accommodation}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#EE6C4D]"
                    />
                    <span className="font-medium">Need Accommodation?</span>
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border border-[#98C1D9] bg-white/60 dark:bg-[#293241]/50 dark:border-[#98C1D9]/35 px-4 py-3 text-[#293241] dark:text-[#E0FBFC] transition hover:border-[#EE6C4D] has-[:checked]:border-[#EE6C4D] has-[:checked]:bg-[#EE6C4D]/10">
                    <input
                      type="checkbox"
                      name="nonVeg"
                      checked={formData.nonVeg}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#EE6C4D]"
                    />
                    <span className="font-medium">Non-Veg?</span>
                  </label>
                </div>
              </section>

              <div className="reg-rise" style={{ animationDelay: ".65s" }}>
                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-md bg-[#EE6C4D] py-3 font-bold text-white shadow-[0_12px_28px_-10px_rgba(238,108,77,0.8)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-10px_rgba(238,108,77,0.9)] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D5A80] focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-[20deg] bg-white/30 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-[520%]"
                  />
                  <span className="relative">{saving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ValidationDialog
        open={showCollegeEmailDialog}
        title="Please use your college email"
        message="National Institute of Technology, Meghalaya requires an email ending with @nitm.ac.in."
        onClose={() => setShowCollegeEmailDialog(false)}
      />

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
        <div className="reg-fade fixed inset-0 z-50 flex items-center justify-center bg-[#293241]/55 backdrop-blur-sm p-4">
          <div
            className={`reg-pop relative w-80 max-w-full overflow-hidden rounded-[3px] border-y-[6px] border-[#3D5A80] dark:border-[#98C1D9] px-6 py-8 text-center shadow-[0_30px_70px_-20px_rgba(41,50,65,0.7)] ${paperCls}`}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D]" />
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#EE6C4D] text-white shadow-[0_6px_14px_-4px_rgba(238,108,77,0.7)] -rotate-6">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#EE6C4D]">
              Profile Updated!
            </h2>
            <p className="mt-2 text-[#293241] dark:text-[#E0FBFC]">
              Your profile has been successfully updated.
            </p>
            <button
              className="mt-5 rounded-md bg-[#EE6C4D] px-5 py-2.5 font-semibold text-white shadow-[0_10px_22px_-10px_rgba(238,108,77,0.8)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(238,108,77,0.9)]"
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