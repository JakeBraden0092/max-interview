import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="bg-white" data-cy="order-confirmation-page">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          {/* Success icon */}
          <div className="mx-auto h-12 w-12 rounded-full bg-green-100 p-2 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Order confirmed!</h1>
          <p className="mt-2 text-base text-gray-500" data-cy="order-number">
            Order number: <span className="font-medium text-gray-900">{id}</span>
          </p>
          <p className="mt-2 text-base text-gray-500">
            We've sent your order confirmation and receipt to your email.
          </p>
        </div>

        <div className="mt-12">
          <div className="rounded-lg bg-gray-50 px-6 py-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 text-sm font-medium">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Shipping information</p>
              </div>

              <div className="mt-4">
                <div className="border-t border-gray-200 py-4">
                  <div className="text-gray-500">
                    <p>Standard shipping</p>
                    <p className="mt-2">Estimated delivery in 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-500">
                Need help with your order? <a href="#" className="text-primary-600 hover:text-primary-500">Contact us</a>
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
            data-cy="continue-shopping-link"
          >
            Continue shopping
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;