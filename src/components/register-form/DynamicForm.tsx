import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const minValue = min !== undefined ? min : 0;
    const maxValue = max !== undefined ? max : 0;

    const newFields: Field[] = [];
    
    for (let i = 0; i < maxValue; i++) {
      const isRequired = i < minValue;
      const memberLabel = i === 0 ? 'Leader' : `Member ${i}`;
      
      newFields.push(
        {
          id: `name_${i}`,
          label: `${memberLabel} Name`,
          type: 'text',
          required: isRequired,
          memberIndex: i
        },
        {
          id: `roll_${i}`,
          label: `${memberLabel} Roll Number`,
          type: 'text',
          required: isRequired,
          memberIndex: i
        },
        {
          id: `phone_${i}`,
          label: `${memberLabel} Phone Number`,
          type: 'tel',
          required: isRequired,
          memberIndex: i
        }
      );
    }

    setFields(newFields);
    
    const initialData: Record<string, string> = {};
    newFields.forEach(field => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
    setLoading(false);
  }, [eventId, min, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
      
      if (field.type === 'tel' && formData[field.id]?.trim()) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid phone number';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const teamData = [];
      for (let i = 0; i < (max || 0); i++) {
        teamData.push({
          name: formData[`name_${i}`],
          rollNumber: formData[`roll_${i}`],
          phone: formData[`phone_${i}`]
        });
      }
      console.log('Team data submitted:', { eventId, eventName, team: teamData });
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">Submission Successful!</h2>
        <p className="text-gray-700">Thank you for your registration.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData(fields.reduce((obj, field) => ({ ...obj, [field.id]: '' }), {}));
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Submit Another Response
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
      className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Registration Form for {eventName || eventId}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {Object.entries(groupedFields).map(([memberIndex, memberFields], index) => (
          <motion.div
            key={memberIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="mb-6 border-b pb-4 last:border-b-0"
          >
            <h3 className="text-lg font-semibold mb-3">
              {index === 0 ? 'Team Leader' : `Team Member ${index}`}
            </h3>
            {memberFields.map((field) => (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className="block text-gray-700 font-medium mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors[field.id] ? 'border-red-500' : 'border-gray-300'
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
        ))}
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-6"
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DynamicForm;