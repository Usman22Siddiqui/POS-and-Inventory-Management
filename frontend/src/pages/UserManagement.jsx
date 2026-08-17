import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { usersApi, authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'cashier',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      if (res.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.register(newUser);
      if (res.success) {
        toast.success(`Account created for ${newUser.username}`);
        setIsCreateModalOpen(false);
        setNewUser({ username: '', email: '', password: '', role: 'cashier' });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser?.id) {
      toast.error('You cannot deactivate your own account');
      return;
    }

    try {
      const res = await usersApi.update(user.id, { is_active: !user.is_active });
      if (res.success) {
        toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await usersApi.update(userId, { role: newRole });
      if (res.success) {
        toast.success('Role updated');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (!window.confirm(`Delete user account "${user.username}"?`)) return;

    try {
      const res = await usersApi.delete(user.id);
      if (res.success) {
        toast.success(`User "${user.username}" deleted`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Staff & Role Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage staff accounts, enforce backend role-based access control
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <FiUserPlus /> Add New Staff Member
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            Loading staff accounts...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Account Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="select"
                      style={{ padding: '4px 28px 4px 8px', fontSize: '0.8125rem' }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === currentUser?.id}
                    >
                      <option value="admin">Admin</option>
                      <option value="inventory_manager">Inventory Manager</option>
                      <option value="cashier">Cashier</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {new Date(u.created_at || u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {u.id !== currentUser?.id && (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleToggleStatus(u)}
                            title={u.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => handleDeleteUser(u)}
                            title="Delete Account"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New Staff</h2>
              <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label className="input-label">Username *</label>
                  <input
                    type="text"
                    className="input"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="e.g. jdoe_cashier"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Email *</label>
                  <input
                    type="email"
                    className="input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="jdoe@teerop.com"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Temporary Password *</label>
                  <input
                    type="password"
                    className="input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Role Access Tier *</label>
                  <select
                    className="select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="cashier">Cashier (POS & Own Transactions only)</option>
                    <option value="inventory_manager">Inventory Manager (Product CRUD & Stock)</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
