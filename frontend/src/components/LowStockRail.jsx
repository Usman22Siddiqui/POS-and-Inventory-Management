import React, { useState, useEffect } from 'react';
import { FiAlertOctagon, FiChevronRight, FiChevronLeft, FiRefreshCw } from 'react-icons/fi';
import { productsApi } from '../api';
import { CategoryBadge } from './CategoryBadge';

export const LowStockRail = ({ isOpen, onToggle, onSelectProduct }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getLowStock();
      if (res.success) {
        setItems(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load low stock items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <aside className={`low-stock-rail ${isOpen ? '' : 'collapsed'}`}>
        <div className="low-stock-rail-header">
          <h3>
            <FiAlertOctagon style={{ color: 'var(--danger)' }} />
            <span>Low Stock Alerts</span>
            <span className="low-stock-count">{items.length}</span>
          </h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={fetchLowStock}
              title="Refresh"
              style={{ padding: '4px 6px' }}
            >
              <FiRefreshCw size={13} className={loading ? 'pulse-warning' : ''} />
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onToggle}
              title="Close Rail"
              style={{ padding: '4px 6px' }}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="low-stock-rail-body">
          {items.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              All inventory levels are currently above reorder thresholds.
            </div>
          ) : (
            items.map((prod) => (
              <div
                key={prod.id}
                className="low-stock-item"
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                style={{ cursor: onSelectProduct ? 'pointer' : 'default' }}
              >
                <div className="low-stock-item-info">
                  <div className="low-stock-item-name">{prod.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <CategoryBadge category={prod.category} showIcon={false} />
                    <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {prod.sku}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="low-stock-item-stock">
                    {prod.quantity_in_stock} left
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    (Min {prod.reorder_threshold})
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
