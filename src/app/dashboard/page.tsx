import StudentInfo from "@/components/dashboard/StudentInfo"
import ContactInfo from "@/components/dashboard/ContactInfo"
import EventInfo from "@/components/dashboard/EventInfo"
import AdditionalInfo from "@/components/dashboard/AdditionalInfo"
import EditButton from "@/components/dashboard/EditButton"
import { studentData } from "@/data/studentData"


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-teal-950 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl mt-20 font-bold text-center text-teal-50 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudentInfo student={studentData} />
        <ContactInfo student={studentData} />
        <EventInfo student={studentData} />
        <AdditionalInfo student={studentData} />
      </div>
      <div className="flex justify-center mt-6">
          <EditButton />
      </div>
    </div>
  )
}

