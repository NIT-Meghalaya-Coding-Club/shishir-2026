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

interface DynamicFormProps {
  eventId: string;
  eventName?: string;
  min?: number;
  max?: number;
}

const DynamicForm = ({ eventId, eventName, min, max }: DynamicFormProps) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

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

    const minValue = min !== undefined ? min : 0;
    const maxValue = max !== undefined ? max : 0;

    const newFields: Field[] = [];

    for (let i = 0; i < maxValue; i++) {
      const isRequired = i < minValue;
      const memberLabel = i === 0 ? "Leader" : `Member ${i}`;

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
    if (session?.user?.name) {
      initialData["name_0"] = session.user.name;
    }
    setFormData(initialData);
    setLoading(false);
    setLoading(false);
  }, [eventId, min, max, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

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
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
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
      const teamData = [];
      for (let i = 0; i < (max || 0); i++) {
        teamData.push({
          name: formData[`name_${i}`],
          rollNumber: formData[`roll_${i}`],
          phone: formData[`phone_${i}`],
        });
      }

      // console.log('Team data submitted:', { userId: 'gauravcodes123@gmail.com', eventId, teamData });
      // return;

      try {
        setLoading(true);

        const res = await fetch(`/api/event/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session?.user?.email,
            eventId,
            teamData,
          }),
        });

        const data = await res.json(); // Parse response

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
            router.push('/')
          }}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          Go back to Shishir
        </button>
      </motion.div>
    );
  }

  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.memberIndex]) {
      acc[field.memberIndex] = [];
    }
    acc[field.memberIndex].push(field);
    return acc;
  }, {} as Record<number, Field[]>);

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
        className={`w-full bg-black/10 px-3 py-2 border rounded-md border-gray-300"
                 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 cursor-not-allowed mb-10`}
      />

      <form onSubmit={handleSubmit}>
        {Object.entries(groupedFields).map(
          ([memberIndex, memberFields], index) => (
            <motion.div
              key={memberIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="mb-6 border-b pb-4 last:border-b-0"
            >
              <h3 className="text-lg font-semibold mb-3">
                {index === 0 ? "Team Leader" : `Team Member ${index}`}
              </h3>
              {memberFields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label
                    htmlFor={field.id}
                    className="block text-gray-300 font-medium mb-1"
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id] || ""}
                    disabled={
                      field.memberIndex === 0 && field.id.startsWith("name_")
                    }
                    onChange={handleChange}
                    className={`w-full bg-black/10 px-3 py-2 border rounded-md ${
                      errors[field.id] ? "border-red-500" : "border-gray-300"
                    } ${
                      field.memberIndex === 0 && field.id.startsWith("name_")
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
          )
        )}

        <div className="sticky bottom-0 w-full  to-transparent">
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
