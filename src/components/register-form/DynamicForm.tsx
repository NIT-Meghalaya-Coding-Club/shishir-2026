import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//Components
import Loading from "@/app/components/Loading";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Field = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  memberIndex: number;
};

type EventType = "individual" | "team" | "performance";

interface DynamicFormProps {
  eventId: string;
  eventName?: string;
  eventType?: EventType;
  min?: number;
  max?: number;
  allowPerformanceTypes?: boolean;
}

const DynamicForm = ({
  eventId,
  eventName,
  eventType = "team",
  min = 1,
  max = 1,
  allowPerformanceTypes = false,
}: DynamicFormProps) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [performanceType, setPerformanceType] = useState<string>("solo");
  const { data: session, status } = useSession();
  const router = useRouter();

  const isIndividualEvent = min === 1 && max === 1;

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.warn("Please log in to register!", { autoClose: 3000 });
      setTimeout(() => {
        router.push("/register");
      }, 1000);
    }
  }, [status, router]);

  useEffect(() => {
    setLoading(true);

    const minValue = min !== undefined ? min : 1;
    const maxValue = max !== undefined ? max : 1;

    const newFields: Field[] = [];

    // Add group name field for team or performance events if there are multiple members
    if (
      !isIndividualEvent &&
      (eventType === "team" || eventType === "performance")
    ) {
      newFields.push({
        id: "group_name",
        label: "Group/Team Name",
        type: "text",
        required: true,
        memberIndex: -1, // Special index for non-member fields
      });
    }

    // Add performance type selector for performance events
    if (allowPerformanceTypes && eventType === "performance") {
      newFields.push({
        id: "performance_type",
        label: "Performance Type",
        type: "select",
        required: true,
        memberIndex: -1,
      });
    }

    // Create member fields (maintaining the original structure)
    for (let i = 0; i < maxValue; i++) {
      let memberLabel;

      if (isIndividualEvent) {
        memberLabel = "Participant";
      } else if (i === 0) {
        memberLabel = "Team Leader";
      } else {
        memberLabel = `Member ${i}`;
      }

      const isRequired = i < minValue;

      newFields.push(
        {
          id: `name_${i}`,
          label: `${memberLabel} Name`,
          type: "text",
          required: isRequired,
          memberIndex: i,
        },
        {
          id: `roll_${i}`,
          label: `${memberLabel} Roll Number`,
          type: "text",
          required: isRequired,
          memberIndex: i,
        },
        {
          id: `phone_${i}`,
          label: `${memberLabel} Phone Number`,
          type: "tel",
          required: isRequired,
          memberIndex: i,
        }
      );
    }

    setFields(newFields);

    const initialData: Record<string, string> = {};
    newFields.forEach((field) => {
      initialData[field.id] = "";
    });

    // Initialize with default values
    if (session?.user?.name) {
      initialData["name_0"] = session.user.name;
    }

    if (allowPerformanceTypes) {
      initialData["performance_type"] = "solo";
    }

    setFormData(initialData);
    setLoading(false);
  }, [
    eventId,
    min,
    max,
    session,
    eventType,
    isIndividualEvent,
    allowPerformanceTypes,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "performance_type") {
      setPerformanceType(value);
    }

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      // Only validate fields for visible members based on performance type
      if (field.memberIndex >= 0) {
        const shouldValidate =
          field.memberIndex < min ||
          (allowPerformanceTypes &&
            ((performanceType === "solo" && field.memberIndex < 1) ||
              (performanceType === "duo" && field.memberIndex < 2) ||
              (performanceType === "trio" && field.memberIndex < 3) ||
              performanceType === "group"));

        if (field.required && shouldValidate && !formData[field.id]?.trim()) {
          newErrors[field.id] = `${field.label} is required`;
        }
      } else {
        // Always validate general fields (group name, performance type)
        if (field.required && !formData[field.id]?.trim()) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }

      if (field.type === "tel" && formData[field.id]?.trim()) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid phone number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Create teamData array to maintain the same format as the original code
      const teamData = [];

      // Determine how many members to include based on event type and performance type
      let effectiveMax = max;
      if (allowPerformanceTypes && eventType === "performance") {
        switch (performanceType) {
          case "solo":
            effectiveMax = 1;
            break;
          case "duo":
            effectiveMax = 2;
            break;
          case "trio":
            effectiveMax = 3;
            break;
          // For "group", use the original max
        }
      }

      // Build the teamData array with the same structure as before
      for (let i = 0; i < effectiveMax; i++) {
        // Only include members that have at least a name
        if (formData[`name_${i}`]?.trim()) {
          teamData.push({
            name: formData[`name_${i}`],
            rollNumber: formData[`roll_${i}`],
            phone: formData[`phone_${i}`],
          });
        }
      }

      // Add metadata to the request body without changing the core structure
      const requestBody = {
        userId: session?.user?.email,
        eventId,
        teamData,
        // Add additional metadata fields that won't break the existing backend
        metadata: {
          eventType,
          groupName: formData.group_name || undefined,
          performanceType: allowPerformanceTypes
            ? formData.performance_type
            : undefined,
        },
      };

      try {
        setLoading(true);

        const res = await fetch(`/api/event/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (res.ok) {
          setSubmitted(true);
          toast.success("Registration successful!", { autoClose: 3000 });
        } else {
          if (data.message === "Already registered for this event") {
            toast.info("You have already registered for this event!", {
              autoClose: 4000,
            });
          } else {
            toast.error(`${data.message || "Failed to register!"}`, {
              autoClose: 4000,
            });
          }
        }
      } catch (error) {
        console.error("Error in Registration:", error);
        toast.error("An error occurred. Please try again later.", {
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Submission Successful!
        </h2>
        <p className="text-white">Thank you for your registration.</p>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          Go back to Shishir
        </button>
      </motion.div>
    );
  }

  // Group fields by member index with special handling for non-member fields
  const groupedFields = fields.reduce((acc, field) => {
    if (field.memberIndex === -1) {
      // Special fields that aren't associated with a member
      if (!acc["general"]) {
        acc["general"] = [];
      }
      acc["general"].push(field);
    } else {
      // Member-specific fields
      if (!acc[field.memberIndex]) {
        acc[field.memberIndex] = [];
      }
      acc[field.memberIndex].push(field);
    }
    return acc;
  }, {} as Record<string | number, Field[]>);

  // Determine number of visible members for performance events
  const getVisibleMembersCount = () => {
    if (!allowPerformanceTypes || eventType !== "performance") return max;

    switch (performanceType) {
      case "solo":
        return 1;
      case "duo":
        return 2;
      case "trio":
        return 3;
      case "group":
        return max;
      default:
        return max;
    }
  };

  const visibleMembersCount = getVisibleMembersCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white/5 text-white"
    >
      {(status === "loading" || loading) && <Loading />}
      <h2 className="text-2xl font-bold text-center mb-6">
        Registration Form for {eventName || eventId}
      </h2>

      <label htmlFor="email" className="block text-gray-300 font-medium mb-1">
        Email {<span className="text-red-500">*</span>}
      </label>
      <input
        disabled
        type="email"
        id="email"
        value={session?.user?.email || ""}
        className="w-full bg-black/10 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed mb-6"
      />

      <form onSubmit={handleSubmit}>
        {/* General fields (group name, performance type) */}
        {groupedFields["general"] && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 border-b pb-4"
          >
            {groupedFields["general"].map((field) => {
              if (field.type === "select" && field.id === "performance_type") {
                return (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={field.id}
                      className="block text-gray-300 font-medium mb-1"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <select
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      className="w-full bg-blue-950/80 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="solo">Solo</option>
                      <option value="duo">Duo</option>
                      <option value="trio">Trio</option>
                      <option value="group">Group</option>
                    </select>
                    {errors[field.id] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-red-500 text-sm"
                      >
                        {errors[field.id]}
                      </motion.p>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={field.id}
                      className="block text-gray-300 font-medium mb-1"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      className={`w-full bg-black/10 px-3 py-2 border rounded-md ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field.id] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-red-500 text-sm"
                      >
                        {errors[field.id]}
                      </motion.p>
                    )}
                  </div>
                );
              }
            })}
          </motion.div>
        )}

        {/* Member fields */}
        {Object.entries(groupedFields)
          .filter(
            ([key]) => key !== "general" && Number(key) < visibleMembersCount
          )
          .map(([memberIndex, memberFields], index) => {
            const numericIndex = Number(memberIndex);
            let sectionTitle;

            if (isIndividualEvent) {
              sectionTitle = "Participant Details";
            } else if (numericIndex === 0) {
              sectionTitle = "Team Leader";
            } else {
              sectionTitle = `Member ${numericIndex}`;
            }

            return (
              <motion.div
                key={memberIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-6 border-b pb-4 last:border-b-0"
              >
                <h3 className="text-lg font-semibold mb-3">{sectionTitle}</h3>
                {memberFields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={field.id}
                      className="block text-gray-300 font-medium mb-1"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      disabled={
                        field.memberIndex === 0 &&
                        field.id.startsWith("name_") &&
                        !!session?.user?.name
                      }
                      onChange={handleChange}
                      className={`w-full bg-black/10 px-3 py-2 border rounded-md ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } ${
                        field.memberIndex === 0 &&
                        field.id.startsWith("name_") &&
                        session?.user?.name
                          ? "cursor-not-allowed"
                          : ""
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field.id] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-red-500 text-sm"
                      >
                        {errors[field.id]}
                      </motion.p>
                    )}
                  </div>
                ))}
              </motion.div>
            );
          })}

        <div className="sticky bottom-0 w-full to-transparent">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-amber-500 text-white font-semibold py-2 px-4 rounded-t-xl hover:bg-amber-600 transition duration-200 mt-6"
          >
            Submit
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default DynamicForm;
