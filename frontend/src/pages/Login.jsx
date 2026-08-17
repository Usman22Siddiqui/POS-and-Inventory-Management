import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import loginHeroImg from '../assets/illustrations/login-hero.jpg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.username}!`);
      
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'inventory_manager') navigate('/inventory');
      else if (user.role === 'cashier') navigate('/pos');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="login-page">
      {/* 3D Storefront Background Layer with Ambient Lighting */}
      <div className="login-backdrop">
        <motion.img
          src={loginHeroImg}
          alt="Teerop Store Atmosphere"
          className="login-backdrop-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1.03, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="login-backdrop-overlay" />
      </div>

      {/* Centered Frosted Crystal Glassmorphism Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 35, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="login-logo">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1>Teerop POS</h1>
            <p>Multi-Category POS & Inventory Management</p>
          </motion.div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@teerop.com"
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiMail
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiLock
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Shift'} <FiArrowRight />
          </motion.button>
        </form>

        {/* Quick Demo Access Roles */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            Quick Role Switcher (Demo)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <motion.button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('admin@teerop.com', 'admin123')}
              style={{ fontSize: '0.75rem' }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ y: 1 }}
            >
              Admin
            </motion.button>
            <motion.button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('manager@teerop.com', 'manager123')}
              style={{ fontSize: '0.75rem' }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ y: 1 }}
            >
              Manager
            </motion.button>
            <motion.button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('cashier@teerop.com', 'cashier123')}
              style={{ fontSize: '0.75rem' }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ y: 1 }}
            >
              Cashier
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
