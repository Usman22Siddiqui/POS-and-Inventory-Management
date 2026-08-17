import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
  FiArrowUpRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { statsApi } from '../api';
import { CategoryBadge } from '../components/CategoryBadge';
import { Tilt3D } from '../components/Tilt3D';
import { CountUpNumber } from '../components/CountUpNumber';
import { MagneticButton } from '../components/MagneticButton';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await statsApi.getOverview();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        Loading administrative metrics...
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      <div className="page-header">
        <div>
          <h1>Store Administration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Store-wide operations, sales performance, and system health
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/inventory">
            <MagneticButton className="btn btn-ghost" strength={0.2}>
              <FiShoppingBag /> Manage Inventory
            </MagneticButton>
          </Link>
          <Link to="/pos">
            <MagneticButton className="btn btn-primary" strength={0.2}>
              <FiShoppingCart /> Open Register
            </MagneticButton>
          </Link>
        </div>
      </div>

      {/* 3D Metric Cards Grid with Count-Up Numbers, Parallax & Specular Reflection Sweep */}
      <div className="stats-grid">
        <Tilt3D maxTilt={6} depth={20} enableGlow={true}>
          <div className="card card-stat card-glass h-full">
            <div className="stat-icon" style={{ background: 'rgba(99, 107, 47, 0.15)', color: 'var(--moss-primary)' }}>
              <FiDollarSign />
            </div>
            <div className="stat-value">
              <CountUpNumber
                value={stats?.todaySales?.total || 0}
                prefix="$"
                decimals={2}
              />
            </div>
            <div className="stat-label">Today's Revenue ({stats?.todaySales?.count || 0} sales)</div>
          </div>
        </Tilt3D>

        <Tilt3D maxTilt={6} depth={20} enableGlow={true}>
          <div className="card card-stat card-glass h-full">
            <div className="stat-icon" style={{ background: 'rgba(186, 192, 149, 0.3)', color: 'var(--moss-deep)' }}>
              <FiTrendingUp />
            </div>
            <div className="stat-value">
              <CountUpNumber
                value={stats?.allTimeSales?.total || 0}
                prefix="$"
                decimals={2}
              />
            </div>
            <div className="stat-label">All-Time Revenue ({stats?.allTimeSales?.count || 0} txs)</div>
          </div>
        </Tilt3D>

        <Tilt3D maxTilt={6} depth={20} enableGlow={true}>
          <div className="card card-stat card-glass h-full">
            <div className="stat-icon" style={{ background: 'rgba(166, 73, 59, 0.15)', color: 'var(--danger)' }}>
              <FiAlertTriangle />
            </div>
            <div className="stat-value" style={{ color: stats?.lowStockCount > 0 ? 'var(--danger)' : 'inherit' }}>
              <CountUpNumber value={stats?.lowStockCount || 0} />
            </div>
            <div className="stat-label">
              <span className={stats?.lowStockCount > 0 ? 'pulse-warning' : ''} style={{ display: 'inline-block' }}>
                Low-Stock Items
              </span>
            </div>
          </div>
        </Tilt3D>

        <Tilt3D maxTilt={6} depth={20} enableGlow={true}>
          <div className="card card-stat card-glass h-full">
            <div className="stat-icon" style={{ background: 'rgba(212, 222, 149, 0.4)', color: 'var(--moss-deep)' }}>
              <FiUsers />
            </div>
            <div className="stat-value">
              <CountUpNumber value={stats?.activeUsers || 0} />
            </div>
            <div className="stat-label">Active Staff Accounts</div>
          </div>
        </Tilt3D>
      </div>

      {/* Two Column Layout for Recent Sales & Top Products with Staggered Entrance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        {/* Recent Transactions */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Store Transactions</h3>
            <Link to="/stats" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <FiArrowUpRight />
            </Link>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Cashier</th>
                <th>Time</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.slice(0, 5).map((tx, idx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 + 0.2 }}
                >
                  <td className="mono">#{tx.id}</td>
                  <td>{tx.cashier?.username || 'Staff'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    ${parseFloat(tx.total_amount).toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Top Selling Products</h3>
            <Link to="/stats" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Analytics <FiArrowUpRight />
            </Link>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topProducts?.slice(0, 5).map((item, idx) => (
                <motion.tr
                  key={item.product_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 + 0.3 }}
                >
                  <td style={{ fontWeight: 500 }}>{item.product?.name || `Product #${item.product_id}`}</td>
                  <td>
                    <CategoryBadge category={item.product?.category} showIcon={false} />
                  </td>
                  <td className="mono">{item.dataValues?.total_sold || item.total_sold}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    ${parseFloat(item.dataValues?.total_revenue || item.total_revenue || 0).toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};
