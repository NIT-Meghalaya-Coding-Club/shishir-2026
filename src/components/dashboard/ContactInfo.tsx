interface ContactInfoProps {
    student: {
      email: string
      phoneNumber: string
      alternateNumber?: string
    }
  }
  
  export default function ContactInfo({ student }: ContactInfoProps) {
    return (
      <div className="bg-teal-50 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-950 mb-4">Contact Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Email Address</p>
            <p className="mt-1">{student.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Phone Number</p>
            <p className="mt-1">{student.phoneNumber}</p>
          </div>
          {student.alternateNumber && (
            <div>
              <p className="text-sm font-medium text-gray-600">Alternate Contact Number</p>
              <p className="mt-1">{student.alternateNumber}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  