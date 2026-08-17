import React, { useState, useEffect } from 'react';
import { FiClock, FiFileText, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { posApi } from '../api';
import { ReceiptModal } from '../components/ReceiptModal';
import { useAuth } from '../context/AuthContext';

export const MyTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await posApi.getMyTransactions({ limit: 50 });
      if (res.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <div>
          <h1>Transaction History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {user?.role === 'admin'
              ? 'Store-wide register transactions and receipts'
              : 'Your shift sales log and receipts'}
          </p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            Loading sales log...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No transactions found for this shift.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tx Number</th>
                <th>Date & Time</th>
                <th>Items Sold</th>
                <th>Subtotal</th>
                <th>Tax (5%)</th>
                <th>Total Paid</th>
                {user?.role === 'admin' && <th>Cashier</th>}
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => {
                const itemCount = tx.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
                const sub = parseFloat(tx.total_amount) - parseFloat(tx.tax);

                return (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <td className="mono">#{tx.id}</td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td>{itemCount} items</td>
                    <td className="mono">${sub.toFixed(2)}</td>
                    <td className="mono">${parseFloat(tx.tax).toFixed(2)}</td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--moss-deep)' }}>
                      ${parseFloat(tx.total_amount).toFixed(2)}
                    </td>
                    {user?.role === 'admin' && (
                      <td>
                        <span className="badge badge-general">
                          {tx.cashier?.username || 'Staff'}
                        </span>
                      </td>
                    )}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setSelectedTx({
                            id: tx.id,
                            timestamp: tx.timestamp,
                            cashier: tx.cashier?.username || user?.username,
                            items: tx.items?.map((it) => ({
                              name: it.product?.name || `Product #${it.product_id}`,
                              quantity: it.quantity,
                              unitPrice: parseFloat(it.unit_price),
                              subtotal: parseFloat(it.subtotal),
                            })),
                            subtotal: sub,
                            tax: parseFloat(tx.tax),
                            taxRate: '5%',
                            totalAmount: parseFloat(tx.total_amount),
                          });
                        }}
                      >
                        <FiFileText size={13} /> View Slip
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ReceiptModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </motion.div>
  );
};
