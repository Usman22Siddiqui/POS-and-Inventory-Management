import React from 'react';
import { FiPrinter, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AnimatedCheckmark } from './AnimatedCheckmark';
import { MagneticButton } from './MagneticButton';

export const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          padding: 'var(--space-6)',
          perspective: '1000px',
        }}
        initial={{ y: 50, opacity: 0, scale: 0.9, rotateX: 12 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Success Checkmark Draw Animation */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <AnimatedCheckmark size={58} color="#636B2F" />
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              color: 'var(--moss-deep)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            Transaction Approved
          </motion.div>
        </div>

        {/* Physical Paper Receipt Unroll */}
        <motion.div
          className="receipt"
          initial={{ opacity: 0, scaleY: 0, originY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.25,
          }}
          style={{
            transformOrigin: 'top center',
            boxShadow: '0 12px 28px rgba(61, 65, 39, 0.15)',
          }}
        >
          <div className="receipt-header">
            <h2>TEEROP GROCER</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Organic Goods & Essentials
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              Tx #{transaction.id} • {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Cashier: {transaction.cashier}
            </div>
          </div>

          <div className="receipt-items">
            {transaction.items?.map((item, idx) => (
              <div key={idx} className="receipt-item">
                <span className="receipt-item-name">{item.productName || item.name}</span>
                <span className="receipt-item-qty">{item.quantity}x</span>
                <span className="receipt-item-price">${(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-totals">
            <div className="receipt-item">
              <span className="receipt-item-name">Subtotal</span>
              <span className="receipt-item-price">${Number(transaction.subtotal).toFixed(2)}</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-item-name">Flat Tax ({transaction.taxRate || '5%'})</span>
              <span className="receipt-item-price">${Number(transaction.tax).toFixed(2)}</span>
            </div>
            <div className="receipt-item receipt-total-grand">
              <span className="receipt-item-name">Total Paid</span>
              <span className="receipt-item-price">${Number(transaction.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <MagneticButton
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={handlePrint}
            strength={0.2}
          >
            <FiPrinter /> Print Slip
          </MagneticButton>
          <MagneticButton
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onClose}
            strength={0.2}
          >
            Next Customer (Esc)
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
};
