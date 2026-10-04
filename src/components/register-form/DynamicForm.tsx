//TODO: When a form is submitted it doesn't update the Your Submissions content. Rectify that.

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Loading from "@/app/components/Loading";
import { AnimatedButton } from "@/components/events/buttons";

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
  const [hideLeaderWarning, setHideLeaderWarning] = useState(false);
  const [hideLeaderInfo, setHideLeaderInfo] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();


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
          `/api/event/register?eventId=${encodeURIComponent(eventId)}`,
          { cache: "no-store" }
        );
        if (!response.ok) return;

        const data = await response.json();
        const savedRegistrations = data.registrations || [];
        setRegistrations(savedRegistrations);
        if (savedRegistrations[0]) populateRegistration(savedRegistrations[0]);
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
    }
  }, [status, router]);
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

    if (session?.user?.email) {
      initialData["email_0"] = session.user.email;
      setSelectedMembers((previous) => ({
        ...previous,
        0: { name: session.user?.name || "", email: session.user?.email ?? "" },
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
        ? { 0: { name: session.user.name || "", email: session.user.email ?? "" } }
        : {}
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center py-10 sm:py-16 px-4"
      >
        <div className="w-24 h-24 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-[#293241] dark:text-[#E0FBFC] mb-4 text-center">
          {hasExistingRegistration ? "Registration Updated!" : "Registration Successful!"}
        </h2>

        <p className="text-[#3D5A80] dark:text-[#98C1D9] font-medium text-lg mb-10 text-center max-w-md">
          Your registration details have been saved securely.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
          <button
            type="button"
            onClick={startNewRegistration}
            className="w-full sm:w-1/2 bg-[#3D5A80] hover:bg-[#3D5A80]/90 dark:bg-[#3D5A80]/50 dark:hover:bg-[#98C1D9]/30 text-[#E0FBFC] font-extrabold uppercase tracking-widest h-[60px] px-4 rounded-2xl text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md border border-[#3D5A80] dark:border-[#98C1D9]/30 text-sm sm:text-base flex items-center justify-center"
          >
            Register Another
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-53 w-full sm:w-1/2 bg-[#EE6C4D] hover:bg-[#EE6C4D]/90 active:bg-[#EE6C4D]/80 text-[#E0FBFC] font-extrabold uppercase tracking-widest h-[60px] px-4 rounded-2xl shadow-lg hover:shadow-[#EE6C4D]/20 transition-all duration-200 text-sm sm:text-base flex items-center justify-center cursor-pointer"
          >
            <div className="original">Go to Home</div>
            <div className="letters">
              {"Go to Home".split("").map((char, index) => (
                <span key={index} style={{ transitionDelay: `${index * 0.03}s` }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </button>
        </div>
      </motion.div>
    );
  }

  // Add this new block
  if (paymentPending && paymentRequired) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-10 p-6 bg-[#3D5A80]/20 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-[#EE6C4D] mb-4">Payment Required</h2>
        <p className="text-white mb-4">
          Please make a payment of <span className="font-bold">₹{paymentRequired.amount}</span> to complete your registration for {eventName || eventId}.
        </p>
        <img
          src={paymentRequired.qrCodeUrl}
          alt={`QR Code for ${eventName || eventId} Payment`}
          className="mx-auto mb-4 w-48 h-48"
        />
        <p className="text-[#293241] dark:text-[#E0FBFC] mb-6">
          Scan the QR code above to make the payment. Your registration will be confirmed only after the payment is received.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-[#EE6C4D] text-[#E0FBFC] rounded hover:bg-[#EE6C4D]/90 transition"
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
      className="w-full"
    >
      {(status === "loading" || loading) && <Loading />}
      {registrations.length > 0 && (
        <section className="mb-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#EE6C4D]">Your Submissions</h3>
          {registrations.map((registration) => {
            const teamName = registration.metadata?.groupName || registration.teamData[0]?.name || "Unnamed";
            const isSelected = selectedRegistrationId === registration._id;

            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-bold uppercase tracking-wider transition-colors ${isSelected ? "text-[#293241] dark:text-[#E0FBFC]" : "text-[#3D5A80]/60 dark:text-[#98C1D9]/60"}`}>TEAM: {teamName}</span>
                  <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-2xl transition-colors ${isSelected ? "text-[#EE6C4D] bg-[#EE6C4D]/10" : "text-[#3D5A80]/60 dark:text-[#98C1D9]/60 bg-[#3D5A80]/5 dark:bg-[#98C1D9]/5"}`}>
                    {isSelected ? "Editing Now..." : "Click to edit"}
                  </span>
                </div>
                <p className={`mt-1 text-sm transition-colors ${isSelected ? "text-[#3D5A80] dark:text-[#98C1D9]" : "text-[#3D5A80]/50 dark:text-[#98C1D9]/50"}`}>
                  {registration.teamData.map((member) => member.name).filter(Boolean).join(", ")}
                </p>
              </>
            );

            return (
              <button
                key={registration._id}
                type="button"
                onClick={() => populateRegistration(registration)}
                className={`w-full rounded-2xl border px-6 py-4 text-left transition-all duration-300 ${selectedRegistrationId === registration._id
                  ? "border-[#EE6C4D] bg-[#EE6C4D]/10 shadow-md scale-[1.01]"
                  : "opacity-100 grayscale-[70%] border-[#EE6C4D]/50 dark:border-[#EE6C4D]/50 bg-transparent hover:opacity-100 hover:grayscale-0 hover:border-[#EE6C4D] hover:bg-[#EE6C4D]/5 hover:shadow-sm"
                  }`}
              >
                {content}
              </button>
            );
          })}
        </section>
      )}

      {hasExistingRegistration && (

        <div className="mb-8">
          <AnimatedButton
            type="button"
            onClick={startNewRegistration}
            className="mb-8 w-full bg-[#3D5A80] hover:bg-[#3D5A80]/90 dark:bg-[#3D5A80]/50 dark:hover:bg-[#98C1D9]/30 text-[#E0FBFC] font-extrabold uppercase tracking-widest h-16 px-6 rounded-full shadow-sm transition-all duration-300 hover:shadow-md border border-[#3D5A80] dark:border-[#98C1D9]/30 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            SUBMIT ANOTHER REGISTRATION
          </AnimatedButton>
        </div>
      )}

      {!isIndividualEvent && !hideLeaderWarning && (
        <div className="mb-6 rounded-2xl border border-[#EE6C4D]/50 bg-[#EE6C4D]/10 dark:bg-[#293241]/60 p-3 text-sm text-[#293241] dark:text-[#E0FBFC] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[#3D5A80] dark:text-[#98C1D9] font-sm mr-2">
                You are the group leader because you are filling out this form. Your account is added automatically as the first participant. Add other members using the email address registered on Shishir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHideLeaderWarning(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-[#3D5A80] hover:bg-[#98C1D9]/30 hover:text-[#293241] dark:hover:text-[#E0FBFC] transition-colors mr-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {paymentRequired && (
        <p className="text-[#EE6C4D] mb-4">
          Note: A payment of ₹{paymentRequired.amount} is required to complete registration.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {eventType === "team" && participantMax > 1 && (
          <div className="mb-6 border-b pb-4">
            <p className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1">
              Number of Participants <span className="text-red-500">*</span>
            </p>
            <div className="flex w-full items-stretch justify-between rounded-full border border-[#98C1D9] bg-[#3D5A80]/10">
              <button
                type="button"
                aria-label="Remove participant"
                disabled={participantCount <= participantMin}
                onClick={() => setParticipantCount((count) => Math.max(participantMin, count - 1))}
                className="flex items-center justify-center rounded-l-full bg-[#EE6C4D] px-5 hover:bg-[#EE6C4D]/90 transition-colors text-[#E0FBFC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <span
                id="participant_count"
                aria-live="polite"
                className="flex-1 min-w-12 text-center text-lg font-semibold text-[#293241] dark:text-[#E0FBFC] flex items-center justify-center py-2"
              >
                {participantCount}
              </span>
              <button
                type="button"
                aria-label="Add participant"
                disabled={participantCount >= participantMax}
                onClick={() => setParticipantCount((count) => Math.min(participantMax, count + 1))}
                className="flex items-center justify-center rounded-r-full bg-[#EE6C4D] px-5 hover:bg-[#EE6C4D]/90 transition-colors text-[#E0FBFC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
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
                      className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1"
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
                      className="w-full bg-[#3D5A80]/10 dark:bg-[#293241] px-4 py-2 border rounded-full border-[#98C1D9] focus:outline-none focus:ring-2 focus:ring-[#EE6C4D] text-[#293241] dark:text-[#E0FBFC]"
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
                      className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1"
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
                      className="w-full bg-[#3D5A80]/10 dark:bg-[#293241] px-4 py-2 border rounded-full border-[#98C1D9] focus:outline-none focus:ring-2 focus:ring-[#EE6C4D] text-[#293241] dark:text-[#E0FBFC]"
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
                      className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1"
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
                      className={`w-full bg-[#3D5A80]/10 px-4 py-3 border rounded-[2rem] ${errors[field.id] ? "border-red-500" : "border-[#98C1D9]"
                        } focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]`}
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
                      className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1"
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
                      className={`w-full bg-[#3D5A80]/10 px-4 py-2 border rounded-full ${errors[field.id] ? "border-red-500" : "border-[#98C1D9]"
                        } focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]`}
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
                  !hideLeaderInfo && (
                    <div className="rounded-full border border-[#98C1D9]/50 bg-[#98C1D9]/10 dark:bg-[#293241]/60 p-2 text-sm text-[#293241] dark:text-[#E0FBFC] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#98C1D9] text-[#293241]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-[#293241] dark:text-[#E0FBFC] text-base leading-tight">
                            {selectedMembers[0]?.name || session?.user?.name || "Group leader"}
                          </p>
                          <p className="text-[#3D5A80] dark:text-[#98C1D9] text-xs mt-0.5">
                            {selectedMembers[0]?.email || session?.user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ) : memberFields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={field.id}
                      className="block text-[#293241] dark:text-[#E0FBFC] font-medium mb-1"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="flex w-full items-stretch">
                      <input
                        type={field.type}
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        placeholder="member@example.com"
                        className={`w-full bg-[#3D5A80]/10 px-4 py-2 border ${field.memberIndex > 0 ? "rounded-l-full border-r-0" : "rounded-full"
                          } ${errors[field.id] ? "border-red-500" : "border-[#98C1D9]"} ${field.memberIndex === 0 ? "cursor-not-allowed opacity-75" : ""
                          } focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]`}
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
                          className="flex items-center justify-center rounded-r-full bg-[#EE6C4D] px-5 hover:bg-[#EE6C4D]/90 transition-colors border border-[#EE6C4D]"
                        >
                          <img src="/img/search.svg" alt="Search" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {searchResults[field.memberIndex]?.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md border border-[#98C1D9] bg-[#E0FBFC] dark:bg-[#3D5A80] p-2 shadow-lg">
                        {searchResults[field.memberIndex].map((user) => (
                          <button
                            key={user.email}
                            type="button"
                            onClick={() => {
                              setFormData((previous) => ({ ...previous, [field.id]: user.email }));
                              setSelectedMembers((previous) => ({ ...previous, [field.memberIndex]: user }));
                              setSearchResults((previous) => ({ ...previous, [field.memberIndex]: [] }));
                            }}
                            className="block w-full rounded px-2 py-1 text-left text-sm text-[#293241] dark:text-[#E0FBFC] hover:bg-[#98C1D9]/30 dark:hover:bg-[#293241]/50 transition-colors"
                          >
                            <span className="block font-medium">{user.name || "Unnamed user"}</span>
                            <span className="block text-xs text-[#3D5A80] dark:text-[#98C1D9]">{user.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedMembers[field.memberIndex] && (
                      <div className="mt-4 rounded-full border border-[#98C1D9]/50 bg-[#98C1D9]/10 dark:bg-[#293241]/60 p-2 text-sm text-[#293241] dark:text-[#E0FBFC] flex items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#98C1D9] text-[#293241]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="font-medium text-[#293241] dark:text-[#E0FBFC] text-base leading-tight">
                              {selectedMembers[field.memberIndex]?.name || selectedMembers[field.memberIndex]?.email}
                            </p>
                            <p className="text-[#3D5A80] dark:text-[#98C1D9] text-xs mt-0.5">
                              Added
                            </p>
                          </div>
                        </div>
                      </div>
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

        <div className="relative pt-6 mt-8 mb-2 ">
          <AnimatedButton
            type="submit"
            className="w-full bg-[#EE6C4D] hover:bg-[#EE6C4D]/90 active:bg-[#EE6C4D]/80 text-[#E0FBFC] font-extrabold uppercase tracking-widest h-20 px-6 rounded-full shadow-lg hover:shadow-[#EE6C4D]/20 transition-all duration-200 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {paymentRequired ? "PROCEED TO PAYMENT" : "SUBMIT REGISTRATION"}
          </AnimatedButton>
        </div>
      </form>
    </motion.div>
  );
};

export default DynamicForm;