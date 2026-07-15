import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateEmployee, useUpdateEmployee } from '../../hooks/useEmployees';
import type { Employee } from '../../types';

import {
  NAME_REGEX,
  NAME_MESSAGE,
  LAST_NAME_REGEX,
  LAST_NAME_MESSAGE,
  PHONE_REGEX,
  PHONE_MESSAGE,
  POSTAL_REGEX,
  POSTAL_MESSAGE,
  ALPHABETIC_REGEX,
  ALPHABETIC_MESSAGE,
  isXssSafe,
  isValidAddress,
  normalizeSpaces,
} from '../../utils/validation';

const employeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .regex(NAME_REGEX, NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  lastName: z
    .string()
    .trim()
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(LAST_NAME_REGEX, LAST_NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(100, 'Max 100 characters')
    .toLowerCase(),
  contact: z.string().trim().regex(PHONE_REGEX, PHONE_MESSAGE),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' }),
  department: z
    .string()
    .trim()
    .min(1, 'Department is required')
    .max(100)
    .refine(isXssSafe, 'Invalid input detected'),
  designation: z
    .string()
    .trim()
    .min(1, 'Designation is required')
    .max(100)
    .refine(isXssSafe, 'Invalid input detected'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(250, 'Address cannot exceed 250 characters')
    .refine(isValidAddress, 'Please enter a valid address.')
    .refine(isXssSafe, 'Invalid input detected')
    .transform(normalizeSpaces),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  state: z
    .string()
    .trim()
    .min(1, 'State is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  country: z
    .string()
    .trim()
    .min(1, 'Country is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  postalCode: z.string().trim().regex(POSTAL_REGEX, POSTAL_MESSAGE),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

export function EmployeeFormDialog({ isOpen, onClose, employee }: EmployeeFormDialogProps) {
  const isEditMode = !!employee;
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      gender: '' as any,
      department: '',
      designation: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  const currentAddress = useWatch({
    control,
    name: 'address',
    defaultValue: '',
  });

  // Populate form when opening in Edit mode
  useEffect(() => {
    if (isOpen) {
      if (employee) {
        // Need to extract YYYY-MM-DD from full ISO string if editing
        const formattedDate = employee.dateOfBirth
          ? new Date(employee.dateOfBirth).toISOString().split('T')[0]
          : '';

        reset({
          firstName: employee.firstName,
          lastName: employee.lastName || '',
          email: employee.email,
          contact: employee.contact,
          gender: employee.gender as any,
          department: employee.department,
          designation: employee.designation,
          dateOfBirth: formattedDate,
          address: employee.address,
          city: employee.city,
          state: employee.state,
          country: employee.country,
          postalCode: employee.postalCode,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          contact: '',
          gender: '' as any,
          department: '',
          designation: '',
          dateOfBirth: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        });
      }
    }
  }, [isOpen, employee, reset]);

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      if (isEditMode && employee) {
        await updateMutation.mutateAsync({
          id: employee.id,
          data,
        });
        toast.success('Employee updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Employee created successfully');
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Employee' : 'Add Registration'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name (Optional)
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 pt-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('contact')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Numbers only"
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500">{currentAddress?.length || 0} / 250</span>
              </div>
              <input
                {...register('address')}
                maxLength={250}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Street address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="City"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                {...register('state')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="State"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                {...register('country')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Country"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                {...register('postalCode')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Postal Code"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 pt-4">
            Employment Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                {...register('department')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g. Engineering"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                {...register('designation')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g. Software Engineer"
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 mt-6 flex justify-end gap-3 border-t border-gray-100 shrink-0 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : isEditMode ? (
                'Update'
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
