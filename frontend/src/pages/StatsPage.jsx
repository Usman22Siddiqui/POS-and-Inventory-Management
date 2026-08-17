import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiAlertTriangle } from 'react-icons/fi';
import { statsApi } from '../api';
import { CategoryBadge } from '../components/CategoryBadge';

export const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        Loading comprehensive sales & stock analytics...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics & Store Performance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Store-wide sales velocity, product performance, and threshold tracking
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="card card-stat">
          <div className="stat-label">Total Revenue (All Time)</div>
          <div className="stat-value">${stats?.allTimeSales?.total?.toFixed(2) || '0.00'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across {stats?.allTimeSales?.count || 0} completed transactions
          </div>
        </div>

        <div className="card card-stat">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">${stats?.todaySales?.total?.toFixed(2) || '0.00'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats?.todaySales?.count || 0} transactions processed today
          </div>
        </div>

        <div className="card card-stat">
          <div className="stat-label">Average Ticket Size</div>
          <div className="stat-value">
            $
            {stats?.allTimeSales?.count > 0
              ? (stats.allTimeSales.total / stats.allTimeSales.count).toFixed(2)
              : '0.00'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per checkout order</div>
        </div>

        <div className="card card-stat">
          <div className="stat-label">Low-Stock Triggered</div>
          <div className="stat-value" style={{ color: stats?.lowStockCount > 0 ? 'var(--danger)' : 'inherit' }}>
            {stats?.lowStockCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires supplier reorder</div>
        </div>
      </div>

      {/* Top Selling Products Full Breakdown */}
      <div className="card mb-6">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Top Selling Products</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Total Revenue</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {stats?.topProducts?.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              stats?.topProducts?.map((item) => (
                <tr key={item.product_id}>
                  <td className="mono">{item.product?.sku || '—'}</td>
                  <td style={{ fontWeight: 500 }}>{item.product?.name || `Product #${item.product_id}`}</td>
                  <td>
                    <CategoryBadge category={item.product?.category} />
                  </td>
                  <td className="mono">{item.dataValues?.total_sold || item.total_sold} units</td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    ${parseFloat(item.dataValues?.total_revenue || item.total_revenue || 0).toFixed(2)}
                  </td>
                  <td className="mono">${parseFloat(item.product?.price || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Critical Low Stock Thresholds */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--danger)' }}>
          Items Below Reorder Threshold
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Point</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.lowStockProducts?.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  All items are well stocked.
                </td>
              </tr>
            ) : (
              stats?.lowStockProducts?.map((prod) => (
                <tr key={prod.id}>
                  <td className="mono">{prod.sku}</td>
                  <td style={{ fontWeight: 500 }}>{prod.name}</td>
                  <td>
                    <CategoryBadge category={prod.category} />
                  </td>
                  <td className="mono" style={{ color: 'var(--danger)', fontWeight: 700 }}>
                    {prod.quantity_in_stock}
                  </td>
                  <td className="mono">{prod.reorder_threshold}</td>
                  <td>
                    {prod.quantity_in_stock === 0 ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : (
                      <span className="badge badge-warning">Restock Needed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
