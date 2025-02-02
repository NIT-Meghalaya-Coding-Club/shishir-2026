interface ContactInfoProps {
    student: {
      email: string
      phoneNumber: string
      alternateNumber?: string
    }
  }
  
  export default function ContactInfo({ student }: ContactInfoProps) {
    return (
      <div className="backdrop-blur-md border-dashed border-4 border-white/10 shadow-2xl rounded-lg p-6">
        <h2 className="text-xl font-semibold text-pink-100 mb-4">Contact Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-50">Email Address</p>
            <p className="mt-1">{student.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-50">Phone Number</p>
            <p className="mt-1">{student.phoneNumber}</p>
          </div>
          {student.alternateNumber && (
            <div>
              <p className="text-sm font-medium text-gray-50">Alternate Contact Number</p>
              <p className="mt-1">{student.alternateNumber}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  