import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
  FiClock,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleTopBarClass = () => {
    if (user?.role === 'admin') return 'topbar-admin';
    if (user?.role === 'inventory_manager') return 'topbar-manager';
    if (user?.role === 'cashier') return 'topbar-cashier';
    return '';
  };

  const getRoleTitle = () => {
    if (user?.role === 'admin') return 'Admin Portal';
    if (user?.role === 'inventory_manager') return 'Inventory Operations';
    if (user?.role === 'cashier') return 'Point of Sale Terminal';
    return 'Dashboard';
  };

  return (
    <div className="app-layout">
      {/* Sidebar overlay for tablet/mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(61, 65, 39, 0.4)',
              zIndex: 45,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>Teerop POS</h1>
          <span>Grocer & Inventory</span>
        </div>

        <nav className="sidebar-nav">
          {user?.role === 'admin' && (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiGrid />
                <span>Admin Overview</span>
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiShoppingBag />
                <span>Inventory Catalog</span>
              </NavLink>
              <NavLink
                to="/pos"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiShoppingCart />
                <span>POS Register</span>
              </NavLink>
              <NavLink
                to="/stats"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiTrendingUp />
                <span>Analytics & Stats</span>
              </NavLink>
              <NavLink
                to="/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiUsers />
                <span>Staff & Access</span>
              </NavLink>
            </>
          )}

          {user?.role === 'inventory_manager' && (
            <>
              <NavLink
                to="/inventory"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiShoppingBag />
                <span>Inventory Catalog</span>
              </NavLink>
              <NavLink
                to="/stats"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiTrendingUp />
                <span>Analytics & Stock</span>
              </NavLink>
            </>
          )}

          {user?.role === 'cashier' && (
            <>
              <NavLink
                to="/pos"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiShoppingCart />
                <span>Checkout Terminal</span>
              </NavLink>
              <NavLink
                to="/my-transactions"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiClock />
                <span>My Transactions</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.username}</div>
              <div className="sidebar-user-role">{user?.role?.replace('_', ' ')}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              title="Log Out"
              style={{ padding: '6px' }}
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="app-main">
        <header className={`app-topbar ${getRoleTopBarClass()}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', padding: '6px' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <div style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              {getRoleTitle()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                color: user?.role === 'admin' ? '#fff' : 'var(--text-primary)',
                padding: '4px 10px',
              }}
            >
              Shift Active: {user?.username} ({user?.role})
            </span>
          </div>
        </header>

        <main className="app-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
