import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

/**
 * Central route definitions.
 * All route paths come from the ROUTES constant — no string literals here.
 *
 * Current Phase 1 routes: redirect root to /login (placeholder).
 * Phase 5 will add:
 *   - /login → <LoginPage>
 *   - /signup → <SignupPage>
 *   - /dashboard → <ProtectedRoute><Dashboard></ProtectedRoute>
 *   - /dashboard/registrations → <ProtectedRoute><RegistrationList></ProtectedRoute>
 *
 * ProtectedRoute will be added in Phase 5 to redirect unauthenticated users.
 * Principle: Single Responsibility — routes are declared here, not in App.tsx.
 *            Open/Closed — add routes here, don't modify App.tsx.
 */
function AppRoutes(): JSX.Element {
  return (
    <Routes>
      {/* Redirect root to login — Phase 5 will replace this */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Phase 5: Uncomment and import page components */}
      {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}
      {/* <Route path={ROUTES.SIGNUP} element={<SignupPage />} /> */}
      {/* <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
      {/* <Route path={ROUTES.REGISTRATIONS} element={<ProtectedRoute><RegistrationList /></ProtectedRoute>} /> */}

      {/* Temporary placeholder for Phase 1 */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'Inter, sans-serif',
              color: '#0f172a',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                🚀 Employee Registration System
              </h1>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                Phase 1 scaffold is running. Login UI arrives in Phase 5.
              </p>
            </div>
          </div>
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default AppRoutes;
