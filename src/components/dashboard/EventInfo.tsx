interface EventInfoProps {
    student: {
      eventsRegistered: string[]
      teamName?: string
      teamMembers?: string[]
      paymentStatus: string
    }
  }
  
  export default function EventInfo({ student }: EventInfoProps) {
    return (
      <div className="bg-teal-50 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-950 mb-4">Event Participation Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Events Registered For</p>
            <ul className="mt-1 list-disc list-inside">
              {student.eventsRegistered.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          </div>
          {student.teamName && (
            <div>
              <p className="text-sm font-medium text-gray-600">Team Name</p>
              <p className="mt-1">{student.teamName}</p>
            </div>
          )}
          {student.teamMembers && (
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <ul className="mt-1 list-disc list-inside">
                {student.teamMembers.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">Payment Status</p>
            <p className={`mt-1 ${student.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}`}>
              {student.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  