import React, { useState, useEffect } from 'react';
import { FiX, FiUploadCloud, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { productsApi } from '../api';

const CATEGORIES = ['Fragile', 'Cold', 'Tech', 'Cleaning', 'General'];

export const ProductModal = ({ isOpen, onClose, product = null, onSaved }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'General',
    price: '',
    quantity_in_stock: '0',
    reorder_threshold: '10',
    description: '',
    // Category specific
    handling_note: '',
    is_fragile: false,
    expiry_date: '',
    storage_temp: '',
    warranty_period: '',
    serial_number: '',
    is_hazardous: false,
    safety_note: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        category: product.category || 'General',
        price: product.price ? String(product.price) : '',
        quantity_in_stock: product.quantity_in_stock !== undefined ? String(product.quantity_in_stock) : '0',
        reorder_threshold: product.reorder_threshold !== undefined ? String(product.reorder_threshold) : '10',
        description: product.description || '',
        handling_note: product.handling_note || '',
        is_fragile: !!product.is_fragile,
        expiry_date: product.expiry_date || '',
        storage_temp: product.storage_temp || '',
        warranty_period: product.warranty_period ? String(product.warranty_period) : '',
        serial_number: product.serial_number || '',
        is_hazardous: !!product.is_hazardous,
        safety_note: product.safety_note || '',
      });
      if (product.image_url) {
        setImagePreview(product.image_url);
      } else {
        setImagePreview('');
      }
    } else {
      setFormData({
        sku: '',
        name: '',
        category: 'General',
        price: '',
        quantity_in_stock: '0',
        reorder_threshold: '10',
        description: '',
        handling_note: '',
        is_fragile: false,
        expiry_date: '',
        storage_temp: '',
        warranty_period: '',
        serial_number: '',
        is_hazardous: false,
        safety_note: '',
      });
      setImageFile(null);
      setImagePreview('');
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.sku.trim()) errs.sku = 'SKU / Barcode is required';
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errs.price = 'Valid price is required';
    if (parseInt(formData.quantity_in_stock, 10) < 0) errs.quantity_in_stock = 'Stock must be 0 or more';
    if (parseInt(formData.reorder_threshold, 10) < 0) errs.reorder_threshold = 'Threshold must be 0 or more';

    // Category specific
    if (formData.category === 'Cold' && !formData.expiry_date) {
      errs.expiry_date = 'Cold products require an expiry date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('sku', formData.sku);
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', parseFloat(formData.price));
      data.append('quantity_in_stock', parseInt(formData.quantity_in_stock, 10));
      data.append('reorder_threshold', parseInt(formData.reorder_threshold, 10));
      data.append('description', formData.description || '');

      // Append category-specific conditional fields
      if (formData.category === 'Fragile') {
        data.append('handling_note', formData.handling_note || '');
        data.append('is_fragile', formData.is_fragile);
      } else if (formData.category === 'Cold') {
        data.append('expiry_date', formData.expiry_date);
        data.append('storage_temp', formData.storage_temp || '');
      } else if (formData.category === 'Tech') {
        if (formData.warranty_period) data.append('warranty_period', parseInt(formData.warranty_period, 10));
        if (formData.serial_number) data.append('serial_number', formData.serial_number);
      } else if (formData.category === 'Cleaning') {
        data.append('is_hazardous', formData.is_hazardous);
        data.append('safety_note', formData.safety_note || '');
      }

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (product) {
        await productsApi.update(product.id, data);
        toast.success(`Updated "${formData.name}"`);
      } else {
        await productsApi.create(data);
        toast.success(`Created "${formData.name}"`);
      }

      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
        initial={{ opacity: 0, scale: 0.93, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 25 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Inventory Item'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* SKU & Name */}
            <div className="input-group">
              <label className="input-label">SKU / Barcode *</label>
              <input
                type="text"
                name="sku"
                className={`input ${errors.sku ? 'input-error' : ''}`}
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. FRG-001"
                disabled={!!product}
              />
              {errors.sku && <span className="error-text">{errors.sku}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Category *</label>
              <select
                name="category"
                className="select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="input-group full-width">
              <label className="input-label">Product Name *</label>
              <input
                type="text"
                name="name"
                className={`input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Organic Oat Milk 1L"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Price & Stock */}
            <div className="input-group">
              <label className="input-label">Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                className={`input ${errors.price ? 'input-error' : ''}`}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Current Stock *</label>
              <input
                type="number"
                min="0"
                name="quantity_in_stock"
                className={`input ${errors.quantity_in_stock ? 'input-error' : ''}`}
                value={formData.quantity_in_stock}
                onChange={handleChange}
              />
              {errors.quantity_in_stock && <span className="error-text">{errors.quantity_in_stock}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Reorder Threshold *</label>
              <input
                type="number"
                min="0"
                name="reorder_threshold"
                className={`input ${errors.reorder_threshold ? 'input-error' : ''}`}
                value={formData.reorder_threshold}
                onChange={handleChange}
              />
              {errors.reorder_threshold && <span className="error-text">{errors.reorder_threshold}</span>}
            </div>

            {/* Image upload */}
            <div className="input-group">
              <label className="input-label">Product Image</label>
              <label
                className="btn btn-ghost btn-sm"
                style={{ cursor: 'pointer', display: 'flex', gap: '6px' }}
              >
                <FiUploadCloud /> Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              {imagePreview && (
                <div style={{ marginTop: '8px', width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="input-group full-width">
              <label className="input-label">Description (Optional)</label>
              <textarea
                name="description"
                className="input"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product details, origins, sizing..."
              />
            </div>

            {/* ── Category Specific Fields (Conditional) ── */}

            {formData.category === 'Fragile' && (
              <div className="card full-width" style={{ background: 'rgba(166, 73, 59, 0.05)', padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--danger)' }}>
                  Fragile Handling Specifications
                </div>
                <div className="input-group mb-4">
                  <label className="input-label">Handling Instructions</label>
                  <input
                    type="text"
                    name="handling_note"
                    className="input"
                    value={formData.handling_note}
                    onChange={handleChange}
                    placeholder="e.g. Wrap individually in bubble wrap, keep upright"
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    name="is_fragile"
                    checked={formData.is_fragile}
                    onChange={handleChange}
                  />
                  <span>Display "FRAGILE / HANDLE WITH CARE" warning badge on POS and packing lists</span>
                </label>
              </div>
            )}

            {formData.category === 'Cold' && (
              <div className="card full-width" style={{ background: 'rgba(99, 107, 47, 0.06)', padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--moss-primary)' }}>
                  Cold Chain & Expiration Details
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Expiry Date *</label>
                    <input
                      type="date"
                      name="expiry_date"
                      className={`input ${errors.expiry_date ? 'input-error' : ''}`}
                      value={formData.expiry_date}
                      onChange={handleChange}
                    />
                    {errors.expiry_date && <span className="error-text">{errors.expiry_date}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Storage Temperature</label>
                    <input
                      type="text"
                      name="storage_temp"
                      className="input"
                      value={formData.storage_temp}
                      onChange={handleChange}
                      placeholder="e.g. 2°C - 6°C"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.category === 'Tech' && (
              <div className="card full-width" style={{ background: 'rgba(61, 65, 39, 0.05)', padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--moss-deep)' }}>
                  Tech Warranty & Serialization
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Warranty Period (Months)</label>
                    <input
                      type="number"
                      min="1"
                      name="warranty_period"
                      className="input"
                      value={formData.warranty_period}
                      onChange={handleChange}
                      placeholder="12"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Serial Number (Unique)</label>
                    <input
                      type="text"
                      name="serial_number"
                      className="input"
                      value={formData.serial_number}
                      onChange={handleChange}
                      placeholder="e.g. SN-TECH-98210"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.category === 'Cleaning' && (
              <div className="card full-width" style={{ background: 'rgba(201, 154, 60, 0.08)', padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', color: '#8a6e20' }}>
                  Safety & Hazard Class
                </div>
                <div className="input-group mb-4">
                  <label className="input-label">Safety & Precaution Notes</label>
                  <input
                    type="text"
                    name="safety_note"
                    className="input"
                    value={formData.safety_note}
                    onChange={handleChange}
                    placeholder="e.g. Wear protective goggles and gloves. Well-ventilated areas."
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    name="is_hazardous"
                    checked={formData.is_hazardous}
                    onChange={handleChange}
                  />
                  <span>Hazardous chemical item (Display Caution Chip)</span>
                </label>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
