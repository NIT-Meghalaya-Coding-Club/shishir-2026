import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Components
import Loading from "@/app/components/Loading";
import ValidationDialog from "@/components/ui/ValidationDialog";
import { RegistrationPayloadSchema } from "@/lib/validation/registrationSchema";

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

type UserSummary = {
  name?: string;
  email: string;
  phone?: string;
  collegeID?: string;
};

type RegistrationRecord = {
  _id: string;
  eventId: string;
  teamData: UserSummary[];
  metadata?: {
    groupName?: string;
    performanceType?: string;
    dynamicEventType?: string;
  };
  createdAt?: string;
};

interface DynamicFormProps {
  eventId: string;
  eventName?: string;
  eventType?: EventType;
  min?: number;
  max?: number;
  allowPerformanceTypes?: boolean;
  eventCode?: string;
  paymentRequired?: {  
    amount: number;    // Amount in rupees
    qrCodeUrl: string; // URL to the event-specific QR code image
  };
}

// Event configurations
const EVENT_CONFIGS = {
  dance_comp: {
    events: [
      { id: "solo_duo", name: "Solo and Duo", min: 1, max: 2 },
      { id: "trio_group", name: "Trio & Group", min: 3, max: 10 },
      { id: "traditional", name: "Traditional", min: 1, max: 10 },
    ],
  },
  drama_comp: {
    events: [
      { id: "mono_act", name: "Mono Act", min: 1, max: 1 },
      { id: "group_act", name: "Group Act", min: 2, max: 8 },
    ],
  },
  food_fest: {
    events: [
      { id: "team_dish", name: "Team Participation", min: 3, max: 5 },
    ],
  },
};

const DynamicForm = ({
  eventId,
  eventName,
  eventType = "team",
  min = 1,
  max = 1,
  allowPerformanceTypes = false,
  eventCode,
  paymentRequired,
}: DynamicFormProps) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [performanceType, setPerformanceType] = useState<string>("solo");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [dynamicMin, setDynamicMin] = useState<number>(min);
  const [dynamicMax, setDynamicMax] = useState<number>(max);
  const [participantCount, setParticipantCount] = useState<number>(Math.max(1, min));
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Record<number, UserSummary | null>>({});
  const [searchResults, setSearchResults] = useState<Record<number, UserSummary[]>>({});
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [, setUserData] = useState({
    registered: false,
  });
  const [dataFetched, setDataFetched] = useState(false);
  

  // Check if this is an event that needs dynamic configuration
  const isDynamicEvent =
    !!eventCode && 
    (eventCode === "dance_comp" || eventCode === "drama_comp" || eventCode === "food_fest");

  const participantMin = isDynamicEvent ? dynamicMin : Math.max(1, Number(min) || 1);
  const participantMax = isDynamicEvent
    ? Math.max(dynamicMin, dynamicMax)
    : Math.max(participantMin, Number(max) || 1);

  // Set isIndividualEvent dynamically based on either props or selected event
  const isIndividualEvent = dynamicMin === 1 && dynamicMax === 1;

  // Check if this is a food fest event
  const isFoodFestEvent = eventCode === "food_fest";

  useEffect(() => {
    setParticipantCount((previous) =>
      Math.min(Math.max(previous, participantMin), participantMax)
    );
  }, [participantMin, participantMax]);

  const populateRegistration = useCallback((registration: RegistrationRecord) => {
    const savedMetadata = registration.metadata || {};
    const savedTeamData = registration.teamData || [];
    setSelectedRegistrationId(registration._id);
    setHasExistingRegistration(true);
    setSubmitted(false);
    setPaymentPending(false);
    setParticipantCount(Math.min(Math.max(savedTeamData.length, participantMin), participantMax));
    setPerformanceType(savedMetadata.performanceType || "solo");
    setSelectedEvent(savedMetadata.dynamicEventType || "");
    setFormData((previous) => ({
      ...previous,
      group_name: savedMetadata.groupName || "",
      performance_type: savedMetadata.performanceType || "solo",
      event_type: savedMetadata.dynamicEventType || "",
      ...savedTeamData.reduce((values: Record<string, string>, member, index) => {
        values[`email_${index}`] = member.email || "";
        return values;
      }, {}),
    }));
    setSelectedMembers(
      savedTeamData.reduce((members: Record<number, UserSummary>, member, index) => {
        members[index] = member;
        return members;
      }, {})
    );
  }, [participantMin, participantMax]);

  useEffect(() => {
    if (status !== "authenticated" || !eventId) return;

    const loadRegistration = async () => {
      try {
        const response = await fetch(
          `/api/event/register?eventId=${encodeURIComponent(eventId)}&all=true`,
          { cache: "no-store" }
        );
        if (!response.ok) return;

        const data = await response.json();
        const savedRegistrations = data.registrations || [];
        setRegistrations(savedRegistrations);
        const currentEventRegistration = savedRegistrations.find(
          (registration: RegistrationRecord) => registration.eventId === eventId
        );
        if (currentEventRegistration) populateRegistration(currentEventRegistration);
      } catch (error) {
        console.error("Failed to load registration:", error);
      }
    };

    loadRegistration();
  }, [eventId, populateRegistration, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.warn("Please log in to register!", { autoClose: 3000 });
      setTimeout(() => {
        router.push("/register");
      }, 1000);
    } else if (status === "authenticated" && session && session.user?.email && !dataFetched) {
      // Fetch user data to check registration status
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/user/get-info/${session?.user?.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            console.log("User data fetched:", data);
            setUserData({
              registered: data.user?.registered || false
            });
            
            // If the user is not registered, prompt for registration
            if (!data.user?.registered) {
              setTimeout(() => {
                setShowModal(true);
              }, 1000);
            }
            
            setDataFetched(true);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }
  }, [status, router, session, dataFetched]);
    // Event selection handler for dynamic events
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventValue = e.target.value;
    setSelectedEvent(eventValue);

    if (eventCode && EVENT_CONFIGS[eventCode as keyof typeof EVENT_CONFIGS]) {
      const eventConfig = EVENT_CONFIGS[
        eventCode as keyof typeof EVENT_CONFIGS
      ].events.find((event) => event.id === eventValue);

      if (eventConfig) {
        setDynamicMin(eventConfig.min);
        setDynamicMax(eventConfig.max);
        setFormData((prev) => {
          const updatedData = { ...prev, event_type: eventValue };
          console.log("Updated formData:", updatedData); // Debug log
          return updatedData;
        });
      }
    }
  };

  useEffect(() => {
    setLoading(true);

    // Use dynamic values if available, otherwise fall back to props
    const minValue = isDynamicEvent ? dynamicMin : Math.max(1, Number(min) || 1);
    const maxValue = isDynamicEvent
      ? Math.max(dynamicMin, dynamicMax)
      : Math.max(minValue, Number(max) || 1);

    const newFields: Field[] = [];

    // Add event type selector for dynamic events
    if (isDynamicEvent && eventCode) {
      newFields.push({
        id: "event_type",
        label: "Event Type",
        type: "select",
        required: true,
        memberIndex: -1,
      });
    }

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
    // Only add this for non-dynamic events since dynamic events use their own selectors
    if (
      allowPerformanceTypes &&
      eventType === "performance" &&
      !isDynamicEvent
    ) {
      newFields.push({
        id: "performance_type",
        label: "Performance Type",
        type: "select",
        required: true,
        memberIndex: -1,
      });
    }

    // Each participant is selected by their registered email address.
    for (let i = 0; i < maxValue; i++) {
      let memberLabel;

      if (isIndividualEvent) {
        memberLabel = "Participant";
      } else if (i === 0) {
        memberLabel = "Team Leader";
      } else {
        memberLabel = `Member ${i + 1}`;
      }

      const isRequired = i < minValue;

      newFields.push(
        {
          id: `email_${i}`,
          label: `${memberLabel} Email`,
          type: "email",
          required: isRequired,
          memberIndex: i,
        }
      );
    }

    setFields(newFields);

    const initialData: Record<string, string> = {};
    newFields.forEach((field) => {
      initialData[field.id] = formData[field.id] || ""; // Preserve existing values
    });

    const sessionUser = session?.user;
    if (sessionUser?.email) {
      const leaderEmail = String(sessionUser.email);
      const leaderName = String(sessionUser.name || "");
      initialData["email_0"] = leaderEmail;
      setSelectedMembers((previous) => ({
        ...previous,
        0: { name: leaderName, email: leaderEmail },
      }));
    }

    if (allowPerformanceTypes && !isDynamicEvent) {
      initialData["performance_type"] = "solo";
    }

    if (isDynamicEvent && eventCode) {
      const defaultEvent =
        EVENT_CONFIGS[eventCode as keyof typeof EVENT_CONFIGS]?.events[0]?.id;
      if (defaultEvent && !selectedEvent) {
        setSelectedEvent(defaultEvent);
        initialData["event_type"] = defaultEvent; // Set default event type
        const eventConfig =
          EVENT_CONFIGS[eventCode as keyof typeof EVENT_CONFIGS].events[0];
        setDynamicMin(eventConfig.min);
        setDynamicMax(eventConfig.max);
      } else if (selectedEvent) {
        initialData["event_type"] = selectedEvent; // Preserve selected event type
      }
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
    dynamicMin,
    dynamicMax,
    eventCode,
    isDynamicEvent,
    selectedEvent,
    isFoodFestEvent,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (
      id === "event_type" &&
      isDynamicEvent &&
      e.target instanceof HTMLSelectElement
    ) {
      handleEventChange(e as React.ChangeEvent<HTMLSelectElement>);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
      if (id === "performance_type") {
        setPerformanceType(value);
      }
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
      // Only validate fields for visible members based on performance type and dynamic event settings
      if (field.memberIndex >= 0) {
        const currentMin = isDynamicEvent ? dynamicMin : min;
        const shouldValidate =
          field.memberIndex < currentMin ||
          (allowPerformanceTypes &&
            !isDynamicEvent &&
            ((performanceType === "solo" && field.memberIndex < 1) ||
              (performanceType === "duo" && field.memberIndex < 2) ||
              (performanceType === "trio" && field.memberIndex < 3) ||
              performanceType === "group"));

        if (field.required && shouldValidate && !formData[field.id]?.trim()) {
          newErrors[field.id] = `${field.label} is required`;
        }
      } else {
        // Always validate general fields (group name, performance type, event type)
        if (field.required && !formData[field.id]?.trim()) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }

    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setValidationMessage(Object.values(newErrors).join("\n"));
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateForm()) {
      const teamData = [];
      let effectiveMax = isDynamicEvent ? dynamicMax : max;
      if (eventType === "team" && participantMax > 1) {
        effectiveMax = participantCount;
      }
      if (allowPerformanceTypes && eventType === "performance" && !isDynamicEvent) {
        switch (performanceType) {
          case "solo": effectiveMax = 1; break;
          case "duo": effectiveMax = 2; break;
          case "trio": effectiveMax = 3; break;
        }
      }
      for (let i = 0; i < effectiveMax; i++) {
        if (formData[`email_${i}`]?.trim()) {
          teamData.push({
            email: formData[`email_${i}`].trim().toLowerCase(),
          });
        }
      }

      // Add metadata to the request body without changing the core structure
      const requestBody = {
        eventId,
        teamData,
        // Add additional metadata fields that won't break the existing backend
        metadata: {
          eventType,
          groupName: formData.group_name || undefined,
          performanceType:
            allowPerformanceTypes && !isDynamicEvent
              ? formData.performance_type
              : undefined,
          // Add dynamic event information
          dynamicEventCode: eventCode || undefined,
          dynamicEventType: isDynamicEvent ? formData.event_type : undefined,
          minParticipants: isDynamicEvent ? dynamicMin : min,
          maxParticipants: isDynamicEvent ? dynamicMax : max,
        },
        registrationId: selectedRegistrationId,
      };

      const validation = RegistrationPayloadSchema.safeParse(requestBody);
      if (!validation.success) {
        setValidationMessage(validation.error.issues.map((issue) => issue.message).join("\n"));
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/event/register`, {
          method: hasExistingRegistration ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();
  
        if (res.ok) {
          if (paymentRequired) { // Add this condition
            setPaymentPending(true);
            toast.info("Please complete the payment to finalize your registration!", { autoClose: 4000 });
          } else {
            setSubmitted(true);
            toast.success(hasExistingRegistration ? "Registration updated!" : "Registration successful!", { autoClose: 3000 });
          }
        } else {
          if (data.message === "Already registered for this event") {
            toast.info("You have already registered for this event!", { autoClose: 4000 });
          } else {
            toast.error(`${data.message || "Failed to register!"}`, { autoClose: 4000 });
          }
        }
      } catch (error) {
        console.error("Error in Registration:", error);
        toast.error("An error occurred. Please try again later.", { autoClose: 4000 });
      } finally {
        setLoading(false);
      }
    }
  };

  const startNewRegistration = () => {
    setSelectedRegistrationId(null);
    setHasExistingRegistration(false);
    setSubmitted(false);
    setPaymentPending(false);
    setErrors({});
    setParticipantCount(participantMin);
    setPerformanceType("solo");
    setSelectedEvent("");
    setFormData({
      email_0: session?.user?.email || "",
    });
    setSelectedMembers(
      session?.user?.email
        ? { 0: { name: session.user.name || "", email: session.user.email } }
        : {}
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          {hasExistingRegistration ? "Registration Updated!" : "Registration Successful!"}
        </h2>
        <p className="text-white">Your registration details have been saved.</p>
        <button
          type="button"
          onClick={startNewRegistration}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          Submit another registration
        </button>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          Go back to Shishir
        </button>
      </motion.div>
    );
  }
  
  // Add this new block
  if (paymentPending && paymentRequired) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Payment Required</h2>
        <p className="text-white mb-4">
          Please make a payment of <span className="font-bold">₹{paymentRequired.amount}</span> to complete your registration for {eventName || eventId}.
        </p>
        <img
          src={paymentRequired.qrCodeUrl}
          alt={`QR Code for ${eventName || eventId} Payment`}
          className="mx-auto mb-4 w-48 h-48"
        />
        <p className="text-gray-300 mb-6">
          Scan the QR code above to make the payment. Your registration will be confirmed only after the payment is received.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
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

  // Determine number of visible members for performance events and dynamic events
  const getVisibleMembersCount = () => {
    if (eventType === "team" && participantMax > 1) {
      return participantCount;
    }

    // For dynamic events, use the dynamic max
    if (isDynamicEvent) {
      return dynamicMax;
    }

    // For performance events with type selection
    if (
      allowPerformanceTypes &&
      eventType === "performance" &&
      !isDynamicEvent
    ) {
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
    }

    return max;
  };

  const visibleMembersCount = getVisibleMembersCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white/5 text-white"
    >
      <ValidationDialog
        open={Boolean(validationMessage)}
        message={validationMessage}
        onClose={() => setValidationMessage("")}
      />
      {(status === "loading" || loading) && <Loading />}
      {registrations.length > 0 && (
        <section className="mb-6 space-y-3">
          <h3 className="text-lg font-semibold text-amber-300">Your Submissions</h3>
          {registrations.map((registration, index) => {
            const isCurrentEvent = registration.eventId === eventId;
            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">Submission {registrations.length - index}</span>
                  <span className="text-xs text-amber-300">
                    {isCurrentEvent ? "Edit" : registration.eventId}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  {registration.teamData.map((member) => member.name).filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {registration.createdAt
                    ? new Date(registration.createdAt).toLocaleString()
                    : "Saved registration"}
                </p>
              </>
            );

            return isCurrentEvent ? (
              <button
                key={registration._id}
                type="button"
                onClick={() => populateRegistration(registration)}
                className={`w-full rounded-md border p-4 text-left transition ${
                  selectedRegistrationId === registration._id
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-white/15 bg-black/10 hover:border-amber-300/60"
                }`}
              >
                {content}
              </button>
            ) : (
              <div key={registration._id} className="w-full rounded-md border border-white/15 bg-black/10 p-4 text-left">
                {content}
              </div>
            );
          })}
        </section>
      )}
      <h2 className="text-2xl font-bold text-center mb-6">
        Registration Form for {eventName || eventId}
      </h2>
      {!isIndividualEvent && (
        <div className="mb-6 rounded-md border border-amber-400/50 bg-amber-400/10 p-4 text-sm text-amber-100">
          You are the group leader because you are filling out this form. Your account is added automatically as the first participant. Add other members using the email address registered on Shishir.
        </div>
      )}
      {hasExistingRegistration && (
        <button
          type="button"
          onClick={startNewRegistration}
          className="mb-4 w-full px-4 py-2 border border-amber-400 text-amber-300 rounded hover:bg-amber-400/10 transition"
        >
          Submit another registration
        </button>
      )}

      {paymentRequired && (
            <p className="text-amber-400 mb-4">
              Note: A payment of ₹{paymentRequired.amount} is required to complete registration.
            </p>
          )}

      <form onSubmit={handleSubmit}>
        {eventType === "team" && participantMax > 1 && (
          <div className="mb-6 border-b pb-4">
            <p className="block text-gray-300 font-medium mb-1">
              Number of Participants <span className="text-red-500">*</span>
            </p>
            <div className="flex items-center justify-between rounded-md border border-gray-300 bg-black/10 px-2 py-1">
              <button
                type="button"
                aria-label="Remove participant"
                disabled={participantCount <= participantMin}
                onClick={() => setParticipantCount((count) => Math.max(participantMin, count - 1))}
                className="h-10 w-10 rounded-md text-2xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>
              <span
                id="participant_count"
                aria-live="polite"
                className="min-w-12 text-center text-lg font-semibold text-white"
              >
                {participantCount}
              </span>
              <button
                type="button"
                aria-label="Add participant"
                disabled={participantCount >= participantMax}
                onClick={() => setParticipantCount((count) => Math.min(participantMax, count + 1))}
                className="h-10 w-10 rounded-md text-2xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        )}
        {/* General fields (event type, group name, performance type) */}
        {groupedFields["general"] && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 border-b pb-4"
          >
            {groupedFields["general"].map((field) => {
              if (
                field.type === "select" &&
                field.id === "performance_type" &&
                !isDynamicEvent
              ) {
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
              } else if (
                field.type === "select" &&
                field.id === "event_type" &&
                isDynamicEvent &&
                eventCode
              ) {
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
                      value={selectedEvent}
                      onChange={handleChange}
                      className="w-full bg-blue-950/80 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      {EVENT_CONFIGS[
                        eventCode as keyof typeof EVENT_CONFIGS
                      ]?.events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
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
              } else if (field.type === "textarea") {
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
                    <textarea
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full bg-black/10 px-3 py-2 border rounded-md ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="List all utensils you'll need for the food fest (e.g., pans, spatulas, serving plates)"
                    ></textarea>
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-b from-[#1a1c6b] to-[#0c0e33] p-5 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm border border-indigo-500/30">
              <h2 className="text-xl sm:text-3xl font-bold text-amber-400 mb-2">
                Complete Your Registration
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-purple-500 mx-auto mb-4 rounded-full"></div>
              <p className="mt-2 text-sm sm:text-base text-indigo-100">
                You have not completed your registration. Please proceed to set
                up your profile.
              </p>
              <div className="flex flex-col mt-6 sm:mt-8 gap-3">
                <button
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-blue-900 font-medium px-6 py-2 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  onClick={() => router.push("/dashboard/profile-details")}
                >
                  Proceed to Registration
                </button>
                {/* <button
                  className="mt-2 bg-transparent border border-indigo-400/30 text-indigo-200 px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-900/20 transition-all duration-300 text-sm sm:text-base"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button> */}
              </div>
            </div>
          </div>
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
              sectionTitle = `Member ${numericIndex + 1}`;
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
                {numericIndex === 0 ? (
                  <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-3">
                    <p className="font-medium text-emerald-200">
                      {selectedMembers[0]?.name || session?.user?.name || "Group leader"}
                    </p>
                    <p className="mt-1 text-sm text-emerald-300/90">
                      {selectedMembers[0]?.email || session?.user?.email || ""}
                    </p>
                  </div>
                ) : memberFields.map((field) => (
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
                      placeholder="member@example.com"
                      className={`w-full bg-black/10 px-3 py-2 border rounded-md ${
                        errors[field.id] ? "border-red-500" : "border-gray-300"
                      } ${field.memberIndex === 0 ? "cursor-not-allowed opacity-75" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {field.memberIndex > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          const query = formData[field.id]?.trim();
                          if (!query) {
                            setErrors((previous) => ({ ...previous, [field.id]: "Enter an email address first" }));
                            return;
                          }
                          try {
                            const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.message || "User search failed");
                            setSearchResults((previous) => ({ ...previous, [field.memberIndex]: data.users || [] }));
                            if (!data.users?.length) throw new Error("No registered users found \n\n(Please ask the member to register on the Shishir Website otherwise it won't appear)");
                            setErrors((previous) => {
                              const next = { ...previous };
                              delete next[field.id];
                              return next;
                            });
                          } catch (error) {
                            setSearchResults((previous) => ({ ...previous, [field.memberIndex]: [] }));
                            setErrors((previous) => ({ ...previous, [field.id]: error instanceof Error ? error.message : "User not found" }));
                          }
                        }}
                        className="mt-2 rounded-md bg-amber-500 px-3 py-2 font-medium text-blue-950 hover:bg-amber-400"
                      >
                        Find member
                      </button>
                    )}
                    {searchResults[field.memberIndex]?.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md border border-white/15 bg-blue-950/80 p-2">
                        {searchResults[field.memberIndex].map((user) => (
                          <button
                            key={user.email}
                            type="button"
                            onClick={() => {
                              setFormData((previous) => ({ ...previous, [field.id]: user.email }));
                              setSelectedMembers((previous) => ({ ...previous, [field.memberIndex]: user }));
                              setSearchResults((previous) => ({ ...previous, [field.memberIndex]: [] }));
                            }}
                            className="block w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-white/10"
                          >
                            <span className="block font-medium">{user.name || "Unnamed user"}</span>
                            <span className="block text-xs text-gray-300">{user.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedMembers[field.memberIndex] && (
                      <p className="mt-2 text-sm text-emerald-300">
                        Added: {selectedMembers[field.memberIndex]?.name || selectedMembers[field.memberIndex]?.email}
                      </p>
                    )}
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
          {paymentRequired ? "Proceed to Payment" : "Submit"} {/* Update this */}
        </motion.button>
      </div>
      </form>
    </motion.div>
  );
};

export default DynamicForm;