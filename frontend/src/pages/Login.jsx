import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import loginHeroImg from '../assets/illustrations/login-hero.jpg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mouse Parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const heroTranslateX = useTransform(smoothX, [-400, 400], [-18, 18]);
  const heroTranslateY = useTransform(smoothY, [-400, 400], [-18, 18]);
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
      <div className="login-bg-texture" />

      {/* 3D Animated Scene Graphic with Floating Parallax Loop */}
      <motion.div
        className="login-hero login-hero-left"
        style={{
          x: heroTranslateX,
          y: heroTranslateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={loginHeroImg}
          alt="Teerop Store Front"
          initial={{ opacity: 0, x: -90, scale: 0.88 }}
          animate={{
            opacity: 0.95,
            x: 0,
            scale: 1,
            y: [-8, 8, -8],
            rotateZ: [-1.2, 1.2, -1.2],
          }}
          transition={{
            opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            x: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            filter: 'drop-shadow(0 24px 40px rgba(61, 65, 39, 0.28))',
            borderRadius: '24px',
            width: '100%',
          }}
        />
      </motion.div>

      {/* 3D Tilted Glassmorphic Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 35, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <div className="login-logo" style={{ transform: 'translateZ(24px)' }}>
          <h1>Teerop POS</h1>
          <p>Multi-Category POS & Inventory Management</p>
        </div>

        <form onSubmit={handleLogin} className="login-form" style={{ transform: 'translateZ(18px)' }}>
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
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', transform: 'translateZ(12px)' }}>
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
