interface AdditionalInfoProps {
    student: {
      accommodationRequired: string
      foodPreference: string
      emergencyContact: string
    }
  }

  export default function AdditionalInfo({ student }: AdditionalInfoProps) {
    return (
      <div className="bg-pink-50 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-950 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Accommodation Required</p>
            <p className="mt-1">{student.accommodationRequired}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Food Preference</p>
            <p className="mt-1">{student.foodPreference}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
            <p className="mt-1">{student.emergencyContact}</p>
          </div>
        </div>
      </div>
    )
  }
  
  