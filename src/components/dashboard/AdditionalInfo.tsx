interface AdditionalInfoProps {
    student: {
      accommodationRequired: string
      foodPreference: string
      emergencyContact: string
    }
  }

  export default function AdditionalInfo({ student }: AdditionalInfoProps) {
    return (
      <div className="backdrop-blur-md border-dashed border-4 border-white/10 shadow-2xl rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-100 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-50">Accommodation Required</p>
            <p className="mt-1">{student.accommodationRequired}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-50">Food Preference</p>
            <p className="mt-1">{student.foodPreference}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-50">Emergency Contact</p>
            <p className="mt-1">{student.emergencyContact}</p>
          </div>
        </div>
      </div>
    )
  }
  
  