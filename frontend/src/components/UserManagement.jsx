import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
    
    
      
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
     
      
      const response = await adminAPI.getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter
      });
      
    
      
      setUsers(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (err) {
      setError('Failed to fetch users');
      setUsers([]); // Ensure users is always an array
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unverified users
  const fetchUnverifiedUsers = async () => {
    try {
    
      const response = await adminAPI.getUnverifiedUsers();
     
      
      // More defensive approach to ensure we always have an array
      let users = [];
      if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        users = response.data.users;
      }
      
      setUnverifiedUsers(users);
    } catch (err) {
      setUnverifiedUsers([]); // Ensure unverifiedUsers is always an array
    
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUnverifiedUsers();
  }, [currentPage, searchTerm, statusFilter]);

  // Handle user verification
  const handleVerification = async (userId, action) => {
    try {
      await adminAPI.verifyUser(userId, action);
      
      // Refresh data
      await fetchUsers();
      await fetchUnverifiedUsers();
      
      alert(`User ${action}d successfully!`);
    } catch (err) {
    
      alert(`Failed to ${action} user`);
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      await fetchUsers();
      alert('User role updated successfully!');
    } catch (err) {
      
      alert('Failed to update user role');
    }
  };

  // Handle user deletion
  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        await fetchUsers();
        await fetchUnverifiedUsers();
        alert('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage user accounts, verification, and roles</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Users ({users?.length || 0})
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Verification ({unverifiedUsers?.length || 0})
        </button>
      </div>

      {/* All Users Tab */}
      {activeTab === 'all' && (
        <div className="users-section">
          {/* Filters */}
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status ${user.is_verified ? 'verified' : 'unverified'}`}>
                        {user.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td className="actions">
                      {!user.is_verified && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleVerification(user.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleVerification(user.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleUserDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Pending Verification Tab */}
      {activeTab === 'pending' && (
        <div className="pending-users-section">
          <h2>Users Pending Verification</h2>
          {(!unverifiedUsers || !Array.isArray(unverifiedUsers) || unverifiedUsers.length === 0) ? (
            <div className="no-data">No users pending verification</div>
          ) : (
            <div className="pending-users-grid">
              {unverifiedUsers.map((user) => (
                <div key={user.id} className="pending-user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <small>Registered: {formatDate(user.created_at)}</small>
                  </div>
                  <div className="user-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleVerification(user.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleVerification(user.id, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;