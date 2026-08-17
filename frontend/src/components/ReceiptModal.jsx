import React from 'react';
import { FiCheckCircle, FiPrinter, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import receiptImg from '../assets/illustrations/checkout-success.jpg';

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
        style={{ maxWidth: '460px', padding: 'var(--space-6)' }}
        initial={{ y: 50, opacity: 0, scale: 0.92, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <motion.img
            src={receiptImg}
            alt="Success"
            style={{
              width: '110px',
              height: '110px',
              objectFit: 'contain',
              margin: '0 auto 12px auto',
              filter: 'drop-shadow(0 12px 20px rgba(61, 65, 39, 0.2))',
            }}
            animate={{
              y: [-4, 4, -4],
              rotate: [-1, 1, -1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div style={{ color: 'var(--moss-primary)', fontWeight: 700, fontSize: '1.0625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <FiCheckCircle /> Transaction Approved
          </div>
        </div>

        {/* Paper receipt container with 3D paper-unroll styling */}
        <motion.div
          className="receipt"
          initial={{ opacity: 0, scaleY: 0.7, originY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="receipt-header">
            <h2>TEEROP GROCER</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handlePrint}>
            <FiPrinter /> Print Slip
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
            Next Customer (Esc)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
