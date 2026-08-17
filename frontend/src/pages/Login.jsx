import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MagneticButton } from '../components/MagneticButton';
import { MorphingBlobs } from '../components/MorphingBlobs';
import loginHeroImg from '../assets/illustrations/login-hero.jpg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mouse Parallax coordinates for Interactive 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 220 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const cardRotateX = useTransform(smoothY, [-400, 400], [5, -5]);
  const cardRotateY = useTransform(smoothX, [-400, 400], [-5, 5]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = e.clientX - innerWidth / 2;
    const y = e.clientY - innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);
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
    <div className="login-page" onMouseMove={handleMouseMove}>
      {/* 3D Storefront Background with Depth Zoom */}
      <div className="login-backdrop">
        <motion.img
          src={loginHeroImg}
          alt="Teerop Store Atmosphere"
          className="login-backdrop-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{
            scale: [1.04, 1.07, 1.04],
            opacity: 1,
          }}
          transition={{
            scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 1.2 },
          }}
        />
        <div className="login-backdrop-overlay" />
      </div>

      {/* Morphing Ambient Organic Blobs & Gradient Motion */}
      <MorphingBlobs />

      {/* Floating 3D Frosted Crystal Glassmorphism Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 35, scale: 0.94 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [-5, 5, -5],
        }}
        transition={{
          opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
        }}
        style={{
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <div className="login-logo" style={{ transform: 'translateZ(20px)' }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1>Teerop POS</h1>
            <p>Multi-Category POS & Inventory Management</p>
          </motion.div>
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

          <MagneticButton
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
            strength={0.2}
          >
            {loading ? 'Authenticating...' : 'Sign In to Shift'} <FiArrowRight />
          </MagneticButton>
        </form>

        {/* Quick Demo Access Roles */}
        <div style={{ marginTop: '26px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px', transform: 'translateZ(10px)' }}>
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
            <MagneticButton
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('admin@teerop.com', 'admin123')}
              style={{ fontSize: '0.75rem' }}
              strength={0.25}
            >
              Admin
            </MagneticButton>
            <MagneticButton
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('manager@teerop.com', 'manager123')}
              style={{ fontSize: '0.75rem' }}
              strength={0.25}
            >
              Manager
            </MagneticButton>
            <MagneticButton
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleQuickLogin('cashier@teerop.com', 'cashier123')}
              style={{ fontSize: '0.75rem' }}
              strength={0.25}
            >
              Cashier
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
