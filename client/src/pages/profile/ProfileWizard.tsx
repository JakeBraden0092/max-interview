import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

// Step definitions
interface Step {
  id: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic details about you',
  },
  {
    id: 'address',
    title: 'Address Information',
    description: 'Where we can reach you',
  },
  {
    id: 'mailing',
    title: 'Mailing Address',
    description: 'Where we should send your packages',
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Your preferences for our service',
  },
];

const ProfileWizard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  // Initialize form with validation
  const formik = useFormik({
    initialValues: {
      // Personal info
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      dateOfBirth: '',
      
      // Billing address
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      
      // Mailing address (initially same as billing)
      mailingAddressLine1: '',
      mailingAddressLine2: '',
      mailingCity: '',
      mailingState: '',
      mailingPostalCode: '',
      mailingCountry: 'United States',
      
      // Preferences
      emailNotifications: true,
      smsNotifications: false,
      language: 'en',
    },
    validationSchema: Yup.object({
      // Personal info validation
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      phone: Yup.string().required('Phone number is required'),
      dateOfBirth: Yup.date().required('Date of birth is required'),
      
      // Billing address validation
      addressLine1: Yup.string().required('Address line 1 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      postalCode: Yup.string().required('Postal code is required'),
      country: Yup.string().required('Country is required'),
      
      // Mailing address validation (conditional based on sameAsBilling)
      // Mailing address validation (conditional based on sameAsBilling)
mailingAddressLine1: Yup.string().when(['sameAsBilling'], {
    is: (sameAsBilling: boolean) => sameAsBilling === false,
    then: (schema) => schema.required('Address line 1 is required'),
    otherwise: (schema) => schema
  }),
  mailingCity: Yup.string().when(['sameAsBilling'], {
    is: (sameAsBilling: boolean) => sameAsBilling === false,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema
  }),
  mailingState: Yup.string().when(['sameAsBilling'], {
    is: (sameAsBilling: boolean) => sameAsBilling === false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema
  }),
  mailingPostalCode: Yup.string().when(['sameAsBilling'], {
    is: (sameAsBilling: boolean) => sameAsBilling === false,
    then: (schema) => schema.required('Postal code is required'),
    otherwise: (schema) => schema
  }),
  mailingCountry: Yup.string().when(['sameAsBilling'], {
    is: (sameAsBilling: boolean) => sameAsBilling === false,
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema
  }),
    }),
    
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        // In a real app, this would send data to the server via GraphQL
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update user profile status
        updateUser({
          firstName: values.firstName,
          lastName: values.lastName,
          profileCompleted: true
        });
        
        // Navigate to the health survey
        navigate('/survey');
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Handle "same as billing" checkbox
  const handleSameAsBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);
    
    if (checked) {
      formik.setValues({
        ...formik.values,
        mailingAddressLine1: formik.values.addressLine1,
        mailingAddressLine2: formik.values.addressLine2,
        mailingCity: formik.values.city,
        mailingState: formik.values.state,
        mailingPostalCode: formik.values.postalCode,
        mailingCountry: formik.values.country,
      });
    }
  };
  
  // Navigation functions
  const goToNextStep = () => {
    const isStepValid = () => {
      switch (currentStep) {
        case 0: // Personal info
          return !formik.errors.firstName && 
                 !formik.errors.lastName && 
                 !formik.errors.phone && 
                 !formik.errors.dateOfBirth &&
                 formik.touched.firstName &&
                 formik.touched.lastName &&
                 formik.touched.phone &&
                 formik.touched.dateOfBirth;
        case 1: // Billing address
          return !formik.errors.addressLine1 && 
                 !formik.errors.city && 
                 !formik.errors.state && 
                 !formik.errors.postalCode &&
                 !formik.errors.country &&
                 formik.touched.addressLine1 &&
                 formik.touched.city &&
                 formik.touched.state &&
                 formik.touched.postalCode;
        case 2: // Mailing address
          return sameAsBilling || 
                (!formik.errors.mailingAddressLine1 && 
                 !formik.errors.mailingCity && 
                 !formik.errors.mailingState && 
                 !formik.errors.mailingPostalCode &&
                 !formik.errors.mailingCountry);
        default:
          return true;
      }
    };
    
    if (isStepValid()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        formik.submitForm();
      }
    } else {
      // Touch all fields in the current step to show validation errors
      switch (currentStep) {
        case 0: // Personal info
          formik.setFieldTouched('firstName', true);
          formik.setFieldTouched('lastName', true);
          formik.setFieldTouched('phone', true);
          formik.setFieldTouched('dateOfBirth', true);
          break;
        case 1: // Billing address
          formik.setFieldTouched('addressLine1', true);
          formik.setFieldTouched('city', true);
          formik.setFieldTouched('state', true);
          formik.setFieldTouched('postalCode', true);
          formik.setFieldTouched('country', true);
          break;
        case 2: // Mailing address
          if (!sameAsBilling) {
            formik.setFieldTouched('mailingAddressLine1', true);
            formik.setFieldTouched('mailingCity', true);
            formik.setFieldTouched('mailingState', true);
            formik.setFieldTouched('mailingPostalCode', true);
            formik.setFieldTouched('mailingCountry', true);
          }
          break;
      }
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Render the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div data-cy="personal-info-step">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="firstName-input"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-2 text-sm text-red-600" data-cy="firstName-error">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="lastName-input"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-2 text-sm text-red-600" data-cy="lastName-error">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.phone && formik.errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="phone-input"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-2 text-sm text-red-600" data-cy="phone-error">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of birth
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="dateOfBirth-input"
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600" data-cy="dateOfBirth-error">
                      {formik.errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div data-cy="address-step">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                  Address line 1
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.addressLine1 && formik.errors.addressLine1
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.addressLine1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="addressLine1-input"
                  />
                  {formik.touched.addressLine1 && formik.errors.addressLine1 && (
                    <p className="mt-2 text-sm text-red-600" data-cy="addressLine1-error">
                      {formik.errors.addressLine1}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                  Address line 2 (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={formik.values.addressLine2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="addressLine2-input"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.city && formik.errors.city
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="city-input"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="mt-2 text-sm text-red-600" data-cy="city-error">
                      {formik.errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.state && formik.errors.state
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="state-input"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="mt-2 text-sm text-red-600" data-cy="state-error">
                      {formik.errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.postalCode && formik.errors.postalCode
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="postalCode-input"
                  />
                  {formik.touched.postalCode && formik.errors.postalCode && (
                    <p className="mt-2 text-sm text-red-600" data-cy="postalCode-error">
                      {formik.errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    className={`block w-full rounded-md shadow-sm ${
                      formik.touched.country && formik.errors.country
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data-cy="country-input"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                    {/* Add more countries as needed */}
                  </select>
                  {formik.touched.country && formik.errors.country && (
                    <p className="mt-2 text-sm text-red-600" data-cy="country-error">
                      {formik.errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div data-cy="mailing-address-step">
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="sameAsBilling"
                  name="sameAsBilling"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={sameAsBilling}
                  onChange={handleSameAsBillingChange}
                  data-cy="sameAsBilling-checkbox"
                />
                <label htmlFor="sameAsBilling" className="ml-2 block text-sm text-gray-900">
                  Use the same address for shipping
                </label>
              </div>
            </div>
            
            {!sameAsBilling && (
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="mailingAddressLine1" className="block text-sm font-medium text-gray-700">
                    Address line 1
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="mailingAddressLine1"
                      name="mailingAddressLine1"
                      className={`block w-full rounded-md shadow-sm ${
                        formik.touched.mailingAddressLine1 && formik.errors.mailingAddressLine1
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      value={formik.values.mailingAddressLine1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingAddressLine1-input"
                    />
                    {formik.touched.mailingAddressLine1 && formik.errors.mailingAddressLine1 && (
                      <p className="mt-2 text-sm text-red-600" data-cy="mailingAddressLine1-error">
                        {formik.errors.mailingAddressLine1}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="mailingAddressLine2" className="block text-sm font-medium text-gray-700">
                    Address line 2 (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="mailingAddressLine2"
                      name="mailingAddressLine2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={formik.values.mailingAddressLine2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingAddressLine2-input"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="mailingCity" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="mailingCity"
                      name="mailingCity"
                      className={`block w-full rounded-md shadow-sm ${
                        formik.touched.mailingCity && formik.errors.mailingCity
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      value={formik.values.mailingCity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingCity-input"
                    />
                    {formik.touched.mailingCity && formik.errors.mailingCity && (
                      <p className="mt-2 text-sm text-red-600" data-cy="mailingCity-error">
                        {formik.errors.mailingCity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="mailingState" className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="mailingState"
                      name="mailingState"
                      className={`block w-full rounded-md shadow-sm ${
                        formik.touched.mailingState && formik.errors.mailingState
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      value={formik.values.mailingState}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingState-input"
                    />
                    {formik.touched.mailingState && formik.errors.mailingState && (
                      <p className="mt-2 text-sm text-red-600" data-cy="mailingState-error">
                        {formik.errors.mailingState}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="mailingPostalCode" className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="mailingPostalCode"
                      name="mailingPostalCode"
                      className={`block w-full rounded-md shadow-sm ${
                        formik.touched.mailingPostalCode && formik.errors.mailingPostalCode
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      value={formik.values.mailingPostalCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingPostalCode-input"
                    />
                    {formik.touched.mailingPostalCode && formik.errors.mailingPostalCode && (
                      <p className="mt-2 text-sm text-red-600" data-cy="mailingPostalCode-error">
                        {formik.errors.mailingPostalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="mailingCountry" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="mailingCountry"
                      name="mailingCountry"
                      className={`block w-full rounded-md shadow-sm ${
                        formik.touched.mailingCountry && formik.errors.mailingCountry
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      value={formik.values.mailingCountry}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      data-cy="mailingCountry-input"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                      {/* Add more countries as needed */}
                    </select>
                    {formik.touched.mailingCountry && formik.errors.mailingCountry && (
                      <p className="mt-2 text-sm text-red-600" data-cy="mailingCountry-error">
                        {formik.errors.mailingCountry}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div data-cy="preferences-step">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We'll always let you know about important changes, but you can choose what else you want to hear about.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formik.values.emailNotifications}
                      onChange={formik.handleChange}
                      data-cy="emailNotifications-checkbox"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email notifications
                    </label>
                    <p className="text-gray-500">
                      Get updates, special offers, and health tips via email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formik.values.smsNotifications}
                      onChange={formik.handleChange}
                      data-cy="smsNotifications-checkbox"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                      SMS notifications
                    </label>
                    <p className="text-gray-500">
                      Get order updates and delivery notifications via text message.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Language Preference</h3>
                <div className="mt-4">
                  <select
                    id="language"
                    name="language"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    data-cy="language-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white shadow sm:rounded-lg" data-cy="profile-wizard">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
          Complete Your Profile
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Help us personalize your experience by providing some basic information.
        </p>
        
        {/* Progress steps */}
        <div className="mt-8">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {steps.map((step, index) => (
                <li key={step.id} className="md:flex-1">
                  <div
                    className={`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                      index < currentStep
                        ? 'border-primary-600'
                        : index === currentStep
                        ? 'border-primary-400'
                        : 'border-gray-200'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        index < currentStep
                          ? 'text-primary-600'
                          : index === currentStep
                          ? 'text-primary-500'
                          : 'text-gray-500'
                      }`}
                    >
                      Step {index + 1}
                    </span>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        
        {/* Step content */}
        <div className="mt-8">
          <form onSubmit={formik.handleSubmit}>
            {renderStepContent()}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
                data-cy="previous-button"
              >
                Previous
              </button>
              
              <button
                type="button"
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                data-cy="next-button"
              >
                {currentStep === steps.length - 1 ? (
                  isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Complete Profile'
                  )
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileWizard;