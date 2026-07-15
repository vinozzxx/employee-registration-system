import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Lazy loading pages for better initial bundle size
const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const MainLayout = React.lazy(() => import('../layouts/MainLayout'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const ServerError = React.lazy(() => import('../pages/ServerError'));

export const AppRoutes = () => {
  return (
    <React.Suspense
      fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
    >
      <Routes>
        {/* Public Routes (Only accessible if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes (Only accessible if logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Error Pages */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};
