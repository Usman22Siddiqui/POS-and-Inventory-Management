import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Tilt3D } from '../components/Tilt3D';
import { FloatingFrame } from '../components/FloatingFrame';
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
      <div className="login-bg-texture" />

      {/* 3D Floating Scene Graphic */}
      <FloatingFrame
        className="login-hero login-hero-left"
        duration={7}
        yOffset={12}
        rotateOffset={1.2}
      >
        <motion.img
          src={loginHeroImg}
          alt="Teerop Store Front"
          initial={{ opacity: 0, x: -60, scale: 0.9 }}
          animate={{ opacity: 0.9, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            filter: 'drop-shadow(0 20px 30px rgba(61, 65, 39, 0.25))',
            borderRadius: '24px',
          }}
        />
      </FloatingFrame>

      {/* 3D Tilted Glassmorphic Login Card */}
      <Tilt3D
        maxTilt={6}
        depth={24}
        enableGlow={true}
        className="w-full max-w-[450px] z-10"
      >
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
      </Tilt3D>
    </div>
  );
};
