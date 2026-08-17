import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiLayers,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { productsApi } from '../api';
import { CategoryBadge } from '../components/CategoryBadge';
import { ProductModal } from '../components/ProductModal';
import { LowStockRail } from '../components/LowStockRail';
import { Tilt3D } from '../components/Tilt3D';
import { useAuth } from '../context/AuthContext';

const CATEGORY_TABS = ['All', 'Fragile', 'Cold', 'Tech', 'Cleaning', 'General'];

export const InventoryDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [railOpen, setRailOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res;
      if (search || activeCategory !== 'All') {
        res = await productsApi.search({
          name: search || undefined,
          category: activeCategory !== 'All' ? activeCategory : undefined,
        });
      } else {
        res = await productsApi.getAll({ limit: 100 });
      }

      if (res.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (user?.role !== 'admin') {
      toast.error('Only system administrators can delete inventory items');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await productsApi.delete(id);
      toast.success(`"${name}" deleted successfully`);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inventory Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Multi-Category stock control, reorder alerts, and product management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setRailOpen(!railOpen)}
          >
            <FiAlertCircle style={{ color: 'var(--warning)' }} /> Low-Stock Rail
          </button>

          {(user?.role === 'admin' || user?.role === 'inventory_manager') && (
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <FiPlus /> New Product
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="input"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <FiSearch
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

      {/* Product Grid with 3D Tilt Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Loading catalog items...
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px' }}>
          <h3>No items found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Try adjusting your search filter or category selection.
          </p>
        </div>
      ) : (
        <motion.div
          className="product-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
        >
          {products.map((prod, idx) => {
            const isLowStock = prod.quantity_in_stock <= prod.reorder_threshold;
            const isCritical = prod.quantity_in_stock === 0;

            return (
              <Tilt3D
                key={prod.id}
                maxTilt={5}
                depth={16}
                enableFloat={false}
                floatDelay={idx * 0.15}
                className="h-full"
              >
                <div className="product-card h-full">
                  <div className="product-card-img">
                    {prod.image_url ? (
                      <img
                        src={
                          prod.image_url.startsWith('http')
                            ? prod.image_url
                            : `http://localhost:5000${prod.image_url}`
                        }
                        alt={prod.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">
                        <FiLayers />
                      </div>
                    )}

                    <div className="product-card-badges">
                      <CategoryBadge category={prod.category} />
                      {prod.is_fragile && (
                        <span className="badge badge-fragile">Fragile</span>
                      )}
                      {prod.is_hazardous && (
                        <span className="badge badge-cleaning">Hazardous</span>
                      )}
                      {prod.is_expiring_soon && (
                        <span className="badge badge-warning pulse-warning">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-card-body">
                    <div>
                      <div className="product-card-name" title={prod.name}>
                        {prod.name}
                      </div>
                      <div className="product-card-sku">SKU: {prod.sku}</div>

                      {/* Category-specific extra field badges */}
                      {prod.category === 'Cold' && prod.expiry_date && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          Expires: {prod.expiry_date} ({prod.storage_temp || 'Chill'})
                        </div>
                      )}

                      {prod.category === 'Tech' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          Warranty: {prod.warranty_period || 'N/A'} mos • SN: {prod.serial_number || 'N/A'}
                        </div>
                      )}

                      {prod.category === 'Fragile' && prod.handling_note && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '8px' }}>
                          Note: {prod.handling_note}
                        </div>
                      )}

                      {prod.category === 'Cleaning' && prod.safety_note && (
                        <div style={{ fontSize: '0.75rem', color: '#8a6e20', marginBottom: '8px' }}>
                          Safety: {prod.safety_note}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="product-card-footer">
                        <div className="product-card-price">
                          ${parseFloat(prod.price).toFixed(2)}
                        </div>
                        <div
                          className={`product-card-stock ${
                            isCritical ? 'critical' : isLowStock ? 'low' : ''
                          }`}
                        >
                          {prod.quantity_in_stock} in stock
                        </div>
                      </div>

                      {(user?.role === 'admin' || user?.role === 'inventory_manager') && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => handleOpenEditModal(prod)}
                          >
                            <FiEdit2 size={13} /> Edit
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => handleDelete(prod.id, prod.name)}
                              title="Delete Product"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            );
          })}
        </motion.div>
      )}

      {/* Low-Stock Alert Rail Drawer */}
      <LowStockRail
        isOpen={railOpen}
        onToggle={() => setRailOpen(!railOpen)}
        onSelectProduct={(prod) => handleOpenEditModal(prod)}
      />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSaved={fetchProducts}
      />
    </div>
  );
};
