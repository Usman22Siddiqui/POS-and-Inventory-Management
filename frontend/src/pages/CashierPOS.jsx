import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiTrash2, FiPlus, FiMinus, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { posApi, productsApi } from '../api';
import { CategoryBadge } from '../components/CategoryBadge';
import { ReceiptModal } from '../components/ReceiptModal';
import { FloatingFrame } from '../components/FloatingFrame';
import emptyShelfImg from '../assets/illustrations/empty-state.jpg';

export const CashierPOS = () => {
  const [scanQuery, setScanQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const scanInputRef = useRef(null);

  // Auto-focus scanner on mount and after cart changes
  useEffect(() => {
    scanInputRef.current?.focus();
  }, [cart, receiptOpen]);

  // Calculations
  const TAX_RATE = 0.05; // 5% flat tax documented in spec
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const query = scanQuery.trim();
    if (!query) return;

    setLoading(true);
    try {
      // 1. Try SKU exact case-insensitive lookup first
      const res = await posApi.lookup(query);
      if (res.success && res.data.product) {
        addToCart(res.data.product);
        setScanQuery('');
        setShowSearchResults(false);
      }
    } catch (err) {
      // 2. If SKU lookup fails, fallback to name/sku search
      try {
        const searchRes = await productsApi.search({ name: query });
        if (searchRes.success && searchRes.data.products?.length > 0) {
          if (searchRes.data.products.length === 1) {
            addToCart(searchRes.data.products[0]);
            setScanQuery('');
            setShowSearchResults(false);
          } else {
            setSearchResults(searchRes.data.products);
            setShowSearchResults(true);
          }
        } else {
          // 3. Try searching by SKU partial match
          const skuSearchRes = await productsApi.search({ sku: query });
          if (skuSearchRes.success && skuSearchRes.data.products?.length > 0) {
            if (skuSearchRes.data.products.length === 1) {
              addToCart(skuSearchRes.data.products[0]);
              setScanQuery('');
              setShowSearchResults(false);
            } else {
              setSearchResults(skuSearchRes.data.products);
              setShowSearchResults(true);
            }
          } else {
            toast.error(`No product found matching "${query}"`);
          }
        }
      } catch (searchErr) {
        toast.error(`No item found with code "${query}"`);
      }
    } finally {
      setLoading(false);
      // Auto-refocus scanner input for high-speed continuous scanning
      setTimeout(() => scanInputRef.current?.focus(), 50);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + 1;
        
        // App-level stock guard
        if (newQty > product.quantity_in_stock && product.quantity_in_stock !== undefined) {
          toast.error(`Only ${product.quantity_in_stock} units available in stock`);
          return prevCart;
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        if (product.quantity_in_stock !== undefined && product.quantity_in_stock < 1) {
          toast.error(`"${product.name}" is out of stock`);
          return prevCart;
        }
        return [
          ...prevCart,
          {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category,
            quantity: 1,
            maxStock: product.quantity_in_stock,
            is_fragile: product.is_fragile,
            is_hazardous: product.is_hazardous,
          },
        ];
      }
    });

    toast.success(`Scanned: ${product.name}`, { duration: 1500 });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (item.maxStock !== undefined && newQty > item.maxStock) {
              toast.error(`Cannot exceed ${item.maxStock} available units`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setShowSearchResults(false);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty — scan items first');
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await posApi.checkout(payload);
      if (res.success) {
        setLastTransaction(res.data.transaction);
        setReceiptOpen(true);
        setCart([]);
        setShowSearchResults(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Checkout failed';
      toast.error(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="pos-layout">
      {/* ── LEFT PANEL (60%): Scanner + Live Cart ── */}
      <div className="pos-left">
        {/* Scanner Bar pinned at top */}
        <div className="pos-scan-bar">
          <form onSubmit={handleScanSubmit} style={{ position: 'relative' }}>
            <input
              ref={scanInputRef}
              type="text"
              className="input input-scan"
              placeholder="Scan Barcode / Enter SKU (e.g. frg-001, CLD-002) / Search (Press Enter)..."
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 16px',
              }}
              disabled={loading || !scanQuery.trim()}
            >
              <FiSearch /> {loading ? 'Scanning...' : 'Scan Item'}
            </button>
          </form>

          {/* Search suggestions dropdown fallback */}
          {showSearchResults && searchResults.length > 0 && (
            <div
              className="card card-glass"
              style={{
                marginTop: '8px',
                maxHeight: '220px',
                overflowY: 'auto',
                padding: '8px',
                zIndex: 30,
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Select item to add:
              </div>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  className="data-table-row"
                  onClick={() => {
                    addToCart(item);
                    setShowSearchResults(false);
                    setScanQuery('');
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span style={{ marginLeft: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {item.sku}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Item Stream */}
        <div className="pos-cart">
          {cart.length === 0 ? (
            <div className="pos-cart-empty" style={{ padding: '32px 20px' }}>
              <FloatingFrame duration={6} yOffset={6} rotateOffset={0.8}>
                <img
                  src={emptyShelfImg}
                  alt="Empty Register"
                  style={{
                    width: '320px',
                    maxWidth: '90%',
                    height: 'auto',
                    filter: 'drop-shadow(0 16px 32px rgba(61, 65, 39, 0.18))',
                    borderRadius: '20px',
                    border: '1px solid rgba(186, 192, 149, 0.4)',
                  }}
                />
              </FloatingFrame>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginTop: '20px', fontWeight: 600 }}>
                Register Ready for Scanning
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '380px', marginTop: '6px' }}>
                Scan barcodes (case-insensitive) or type SKU/names. Scanned items settle directly into the active cart ticket.
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  /* Section 4: Signature Scan-to-Cart Settle Animation (~200ms with slight overshoot) */
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 24,
                    mass: 0.8,
                  }}
                >
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="cart-item-name">{item.name}</div>
                      <CategoryBadge category={item.category} showIcon={false} />
                      {item.is_fragile && (
                        <span className="badge badge-fragile" style={{ fontSize: '0.625rem' }}>
                          Care
                        </span>
                      )}
                      {item.is_hazardous && (
                        <span className="badge badge-cleaning" style={{ fontSize: '0.625rem' }}>
                          Hazard
                        </span>
                      )}
                    </div>
                    <div className="cart-item-sku">
                      SKU: {item.sku} • ${(item.price).toFixed(2)} / ea
                    </div>
                  </div>

                  <div className="cart-item-qty">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                      <FiMinus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <div className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL (40%): Live Mono Totals + Checkout ── */}
      <div className="pos-right">
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Active Ticket</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
          </div>
          {cart.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn btn-ghost btn-sm"
              onClick={clearCart}
            >
              Clear All
            </motion.button>
          )}
        </div>

        <div className="pos-totals">
          <div className="pos-total-row">
            <span className="pos-total-label">Subtotal</span>
            <span className="pos-total-value">${subtotal.toFixed(2)}</span>
          </div>

          <div className="pos-total-row">
            <span className="pos-total-label">Sales Tax (Flat 5%)</span>
            <span className="pos-total-value">${tax.toFixed(2)}</span>
          </div>

          <div
            className="pos-total-row pos-grand-total"
            style={{
              paddingTop: 'var(--space-4)',
              borderTop: '2px solid var(--moss-deep)',
              marginTop: 'var(--space-2)',
            }}
          >
            <span className="pos-total-label">Total Due</span>
            <span className="pos-total-value">${grandTotal.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <motion.button
              type="button"
              className="btn btn-checkout"
              disabled={cart.length === 0 || checkoutLoading}
              onClick={handleCheckout}
              whileHover={{ scale: cart.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              {checkoutLoading ? (
                'Finalizing Sale...'
              ) : (
                <>
                  <FiCheck /> Charge ${grandTotal.toFixed(2)}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Signature Receipt Modal */}
      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        transaction={lastTransaction}
      />
    </div>
  );
};
