import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layout
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Profile Pages
const ProfileWizard = lazy(() => import('./pages/profile/ProfileWizard'));
const SurveyWizard = lazy(() => import('./pages/profile/SurveyWizard'));

// Shop Pages
const ProductList = lazy(() => import('./pages/shop/ProductList'));
const ProductDetail = lazy(() => import('./pages/shop/ProductDetail'));
const Cart = lazy(() => import('./pages/shop/Cart'));
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/shop/OrderConfirmation'));
const OrderHistory = lazy(() => import('./pages/shop/OrderHistory'));

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/products" /> },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ProductList />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ProductDetail />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Cart />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Checkout />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'order-confirmation/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <OrderConfirmation />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'order-history',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <OrderHistory />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ProfileWizard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'survey',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <SurveyWizard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
  // Redirect unknown routes to home
  { path: '*', element: <Navigate to="/" /> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;