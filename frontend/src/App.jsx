import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { InventoryDashboard } from './pages/InventoryDashboard';
import { CashierPOS } from './pages/CashierPOS';
import { StatsPage } from './pages/StatsPage';
import { MyTransactions } from './pages/MyTransactions';
import { UserManagement } from './pages/UserManagement';

// Dynamic role-based home redirect
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'inventory_manager') return <Navigate to="/inventory" replace />;
  if (user.role === 'cashier') return <Navigate to="/pos" replace />;
  return <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#3D4127',
              color: '#F7F8F1',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(61, 65, 39, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#D4DE95',
                secondary: '#3D4127',
              },
            },
            error: {
              iconTheme: {
                primary: '#A6493B',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Application Routes inside Layout */}
          <Route element={<Layout />}>
            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin & Inventory Manager */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={['admin', 'inventory_manager']}>
                  <InventoryDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin & Cashier */}
            <Route
              path="/pos"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <CashierPOS />
                </ProtectedRoute>
              }
            />

            {/* Admin & Inventory Manager */}
            <Route
              path="/stats"
              element={
                <ProtectedRoute allowedRoles={['admin', 'inventory_manager']}>
                  <StatsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Cashier & Admin */}
            <Route
              path="/my-transactions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <MyTransactions />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
