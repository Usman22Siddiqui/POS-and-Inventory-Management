import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import loginHeroImg from '../assets/illustrations/login-hero.jpg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mouse 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
    <div
      className="login-page"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="login-bg-texture" />

      {/* 3D Animated Scene Graphic with Floating Parallax */}
      <motion.img
        src={loginHeroImg}
        alt="Teerop Store Front"
        className="login-hero login-hero-left"
        initial={{ opacity: 0, x: -60, scale: 0.9 }}
        animate={{ opacity: 0.9, x: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          x: useTransform(mouseX, [-300, 300], [-15, 15]),
          y: useTransform(mouseY, [-300, 300], [-15, 15]),
        }}
      />

      {/* 3D Tilted Glassmorphism Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="login-logo" style={{ transform: 'translateZ(20px)' }}>
          <h1>Teerop POS</h1>
          <p>Multi-Category POS & Inventory Management</p>
        </div>

        <form onSubmit={handleLogin} className="login-form" style={{ transform: 'translateZ(15px)' }}>
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

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Shift'} <FiArrowRight />
          </button>
        </form>

        {/* Quick Demo Access Roles */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', transform: 'translateZ(10px)' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            Quick Role Switcher (Demo)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('admin@teerop.com', 'admin123')}
              style={{ fontSize: '0.75rem' }}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('manager@teerop.com', 'manager123')}
              style={{ fontSize: '0.75rem' }}
            >
              Manager
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('cashier@teerop.com', 'cashier123')}
              style={{ fontSize: '0.75rem' }}
            >
              Cashier
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
