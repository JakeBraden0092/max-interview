import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Payment method types
type PaymentMethod = 'credit-card' | 'paypal';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  
  // Redirect to products if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);
  
  // Form validation schema
  const validationSchema = Yup.object({
    // Shipping information
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    addressLine1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    
    // Payment information (conditional based on payment method)
    cardName: Yup.string().when(['paymentMethod'], {
        is: (paymentMethod: string) => paymentMethod === 'credit-card',
        then: (schema) => schema.required('Name on card is required'),
        otherwise: (schema) => schema
      }),
      cardNumber: Yup.string().when(['paymentMethod'], {
        is: (paymentMethod: string) => paymentMethod === 'credit-card',
        then: (schema) => schema
          .required('Card number is required')
          .matches(/^\d{16}$/, 'Card number must be 16 digits'),
        otherwise: (schema) => schema
      }),
      expDate: Yup.string().when(['paymentMethod'], {
        is: (paymentMethod: string) => paymentMethod === 'credit-card',
        then: (schema) => schema
          .required('Expiration date is required')
          .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format'),
        otherwise: (schema) => schema
      }),
      cvv: Yup.string().when(['paymentMethod'], {
        is: (paymentMethod: string) => paymentMethod === 'credit-card',
        then: (schema) => schema
          .required('CVV is required')
          .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
        otherwise: (schema) => schema
      })
  });
  
  // Initialize form with user data if available
  const formik = useFormik({
    initialValues: {
      // Shipping information
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      
      // Payment information
      paymentMethod: 'credit-card',
      cardName: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
      
      // Save information
      saveInformation: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate a successful order
        const orderId = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${orderId}`);
      } catch (error) {
        console.error('Error processing checkout:', error);
        setIsSubmitting(false);
      }
    },
  });
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    formik.setFieldValue('paymentMethod', method);
  };
  
  return (
    <div className="bg-gray-50" data-cy="checkout-page">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h2>
        <form onSubmit={formik.handleSubmit} className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Shipping & Payment details */}
          <div className="lg:col-span-7">
            {/* Shipping information */}
            <section aria-labelledby="shipping-heading" className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-6 sm:p-6 lg:p-8">
                <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
                  Shipping information
                </h2>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
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
                        data-cy="shipping-firstName"
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="mt-2 text-sm text-red-600" data-cy="firstName-error">
                          {formik.errors.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
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
                        data-cy="shipping-lastName"
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="mt-2 text-sm text-red-600" data-cy="lastName-error">
                          {formik.errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`block w-full rounded-md shadow-sm ${
                          formik.touched.email && formik.errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        data-cy="shipping-email"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-2 text-sm text-red-600" data-cy="email-error">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
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
                        data-cy="shipping-phone"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="mt-2 text-sm text-red-600" data-cy="phone-error">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                      Address
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
                        data-cy="shipping-addressLine1"
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
                      Apartment, suite, etc. (optional)
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
                        data-cy="shipping-addressLine2"
                      />
                    </div>
                  </div>
                  
                  <div>
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
                        data-cy="shipping-city"
                      />
                      {formik.touched.city && formik.errors.city && (
                        <p className="mt-2 text-sm text-red-600" data-cy="city-error">
                          {formik.errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
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
                        data-cy="shipping-state"
                      />
                      {formik.touched.state && formik.errors.state && (
                        <p className="mt-2 text-sm text-red-600" data-cy="state-error">
                          {formik.errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
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
                        data-cy="shipping-postalCode"
                      />
                      {formik.touched.postalCode && formik.errors.postalCode && (
                        <p className="mt-2 text-sm text-red-600" data-cy="postalCode-error">
                          {formik.errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
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
                        data-cy="shipping-country"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
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
            </section>
            
            {/* Payment */}
            <section aria-labelledby="payment-heading" className="mt-6 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-6 sm:p-6 lg:p-8">
                <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
                  Payment
                </h2>
                
                <fieldset className="mt-6">
                  <legend className="sr-only">Payment method</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    <div className="flex items-center">
                      <input
                        id="credit-card"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => handlePaymentMethodChange('credit-card')}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        data-cy="payment-credit-card"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="paypal"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => handlePaymentMethodChange('paypal')}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        data-cy="payment-paypal"
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                  </div>
                </fieldset>
                
                {paymentMethod === 'credit-card' && (
                  <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                        Name on card
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          className={`block w-full rounded-md shadow-sm ${
                            formik.touched.cardName && formik.errors.cardName
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          value={formik.values.cardName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          data-cy="payment-cardName"
                        />
                        {formik.touched.cardName && formik.errors.cardName && (
                          <p className="mt-2 text-sm text-red-600" data-cy="cardName-error">
                            {formik.errors.cardName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          className={`block w-full rounded-md shadow-sm ${
                            formik.touched.cardNumber && formik.errors.cardNumber
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          value={formik.values.cardNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          data-cy="payment-cardNumber"
                        />
                        {formik.touched.cardNumber && formik.errors.cardNumber && (
                          <p className="mt-2 text-sm text-red-600" data-cy="cardNumber-error">
                            {formik.errors.cardNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="expDate" className="block text-sm font-medium text-gray-700">
                        Expiration date (MM/YY)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="expDate"
                          name="expDate"
                          placeholder="MM/YY"
                          className={`block w-full rounded-md shadow-sm ${
                            formik.touched.expDate && formik.errors.expDate
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          value={formik.values.expDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          data-cy="payment-expDate"
                        />
                        {formik.touched.expDate && formik.errors.expDate && (
                          <p className="mt-2 text-sm text-red-600" data-cy="expDate-error">
                            {formik.errors.expDate}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          className={`block w-full rounded-md shadow-sm ${
                            formik.touched.cvv && formik.errors.cvv
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          value={formik.values.cvv}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          data-cy="payment-cvv"
                        />
                        {formik.touched.cvv && formik.errors.cvv && (
                          <p className="mt-2 text-sm text-red-600" data-cy="cvv-error">
                            {formik.errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="mt-6 flex items-center space-x-4">
                    <svg className="h-10" viewBox="0 0 36 36" aria-hidden="true">
                      {/* PayPal logo placeholder */}
                      <rect width="36" height="36" fill="#0070BA" rx="4" />
                      <path
                        fill="#FFF"
                        d="M14.5 13h-2.3c-.2 0-.3.1-.3.3l-.9 5.9c0 .1.1.2.2.2h1.2c.1 0 .2-.1.3-.2l.3-1.7.3.1.3 1.7c0 .1.1.2.2.2h1.2c.1 0 .2-.1.2-.2l.9-5.9c0-.2-.1-.3-.3-.3zM23 13h-2.3c-.2 0-.3.1-.3.3l-.9 5.9c0 .1.1.2.2.2h1.2c.1 0 .2-.1.3-.2l.3-1.7.3.1.3 1.7c0 .1.1.2.2.2h1.2c.1 0 .2-.1.2-.2l.9-5.9c0-.2-.1-.3-.3-.3z"
                      />
                      <path
                        fill="#FFF"
                        d="M18.5 18.9c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        You will be redirected to PayPal to complete your purchase
                      </p>
                      <p className="text-sm text-gray-500">
                        Your order details will be shared with PayPal for processing
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Remember information */}
                <div className="mt-6">
                  <div className="flex items-center">
                    <input
                      id="saveInformation"
                      name="saveInformation"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formik.values.saveInformation}
                      onChange={formik.handleChange}
                      data-cy="save-information"
                    />
                    <label htmlFor="saveInformation" className="ml-2 block text-sm text-gray-900">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            data-cy="checkout-summary"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>
            
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
              </div>
            </dl>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
                data-cy="place-order-button"
              >
                {isSubmitting ? (
                  <svg className="mx-auto h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Place order'
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                By placing your order, you agree to our{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Checkout;