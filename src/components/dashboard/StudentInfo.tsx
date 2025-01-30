interface StudentInfoProps {
    student: {
      fullName: string
      gender: string
      dateOfBirth: string
      collegeName: string
      collegeId: string
      yearOfStudy: string
      department: string
    }
  }
  
  export default function StudentInfo({ student }: StudentInfoProps) {
    return (
      <div className="bg-teal-50 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-950 mb-4">Basic & Academic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Full Name</p>
            <p className="mt-1">{student.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Gender</p>
            <p className="mt-1">{student.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Date of Birth</p>
            <p className="mt-1">{student.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">College Name</p>
            <p className="mt-1">{student.collegeName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">College ID</p>
            <p className="mt-1">{student.collegeId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Year of Study</p>
            <p className="mt-1">{student.yearOfStudy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Department</p>
            <p className="mt-1">{student.department}</p>
          </div>
        </div>
      </div>
    )
  }
  
  