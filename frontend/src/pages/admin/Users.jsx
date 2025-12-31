import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Award, Activity, Search, Download, RefreshCw, Filter, TrendingUp, AlertCircle, Edit, Trash2, Eye, X, Check, Ban } from 'lucide-react';
import './AdminUsers.css';

export default function UsersManagement() {
  // Backend API Configuration
  // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'delete'
  const [editForm, setEditForm] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    uniqueDomains: 0,
    newUsersToday: 0,
    healthcareUsers: 0,
    agricultureUsers: 0,
    environmentUsers: 0
  });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch all users from MongoDB backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        calculateStats(data.users);
      }
      */

      // ============ DUMMY DATA (Remove when API ready) ============
      await new Promise(resolve => setTimeout(resolve, 800));

      const dummyUsers = [
        {
          _id: '1',
          name: 'Dr. Sarah Chen',
          email: 'sarah.chen@hospital.org',
          role: 'Healthcare Specialist',
          domain: 'Healthcare',
          phone: '+1 555-0101',
          location: 'New York, USA',
          projects: 12,
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'SC',
          subscription: 'Premium',
          completedProjects: 8,
          ongoingProjects: 4,
          bio: 'Expert in AI-powered medical diagnostics'
        },
        {
          _id: '2',
          name: 'John Miller',
          email: 'j.miller@agritech.com',
          role: 'Agriculture Expert',
          domain: 'Agriculture',
          phone: '+1 555-0102',
          location: 'Iowa, USA',
          projects: 8,
          status: 'active',
          createdAt: '2024-03-20T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'JM',
          subscription: 'Standard',
          completedProjects: 5,
          ongoingProjects: 3,
          bio: 'Specializing in crop optimization AI'
        },
        {
          _id: '3',
          name: 'Dr. Emily Rodriguez',
          email: 'emily.r@enviro.org',
          role: 'Environmental Scientist',
          domain: 'Environment',
          phone: '+1 555-0103',
          location: 'California, USA',
          projects: 15,
          status: 'active',
          createdAt: '2023-11-10T00:00:00Z',
          lastLogin: new Date().toISOString(),
          avatar: 'ER',
          subscription: 'Premium',
          completedProjects: 10,
          ongoingProjects: 5,
          bio: 'Climate prediction and sustainability'
        },
        {
          _id: '4',
          name: 'Michael Brown',
          email: 'mbrown@health.com',
          role: 'Research Analyst',
          domain: 'Healthcare',
          phone: '+1 555-0104',
          location: 'Boston, USA',
          projects: 6,
          status: 'inactive',
          createdAt: '2024-05-12T00:00:00Z',
          lastLogin: '2024-09-01T00:00:00Z',
          avatar: 'MB',
          subscription: 'Free',
          completedProjects: 4,
          ongoingProjects: 2,
          bio: 'Healthcare data analysis specialist'
        }
      ];

      setUsers(dummyUsers);
      calculateStats(dummyUsers);
      setLastUpdate(new Date());
      showNotification('Users data refreshed successfully!');

    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (usersList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setStats({
      totalUsers: usersList.length,
      activeUsers: usersList.filter(u => u.status === 'active').length,
      totalProjects: usersList.reduce((sum, u) => sum + u.projects, 0),
      uniqueDomains: new Set(usersList.map(u => u.domain)).size,
      newUsersToday: usersList.filter(u =>
        new Date(u.createdAt) >= today
      ).length,
      healthcareUsers: usersList.filter(u => u.domain === 'Healthcare').length,
      agricultureUsers: usersList.filter(u => u.domain === 'Agriculture').length,
      environmentUsers: usersList.filter(u => u.domain === 'Environment').length
    });
  };

  // View user profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm(user);
    setModalType('edit');
    setShowModal(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      // API code commented out...
      const updatedUsers = users.map(u => u._id === editForm._id ? editForm : u);
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      setShowModal(false);
      showNotification('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  // Delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  // Confirm delete
  const confirmDeleteUser = async () => {
    try {
      // API code commented out...
      const updatedUsers = users.filter(u => u._id !== selectedUser._id);
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      setShowModal(false);
      showNotification('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user', 'error');
    }
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      // API code commented out...
      const updatedUsers = users.map(u =>
        u._id === user._id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      showNotification(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('Error updating status', 'error');
    }
  };

  // Export users to CSV
  const handleExportCSV = () => {
    try {
      const csvData = [
        ['User Management Report'],
        ['Generated:', new Date().toLocaleString()],
        [],
        ['User Details'],
        ['Name', 'Email', 'Role', 'Domain', 'Phone', 'Location', 'Projects', 'Status', 'Join Date', 'Subscription'],
        ...users.map(u => [
          u.name,
          u.email,
          u.role,
          u.domain,
          u.phone || 'N/A',
          u.location || 'N/A',
          u.projects,
          u.status,
          new Date(u.createdAt).toLocaleDateString(),
          u.subscription || 'Free'
        ]),
        [],
        ['STATISTICS'],
        ['Total Users', stats.totalUsers],
        ['Active Users', stats.activeUsers],
        ['Total Projects', stats.totalProjects],
        ['Healthcare Users', stats.healthcareUsers],
        ['Agriculture Users', stats.agricultureUsers],
        ['Environment Users', stats.environmentUsers]
      ];

      const csvContent = csvData.map(row =>
        row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('CSV exported successfully!');
    } catch (error) {
      console.error('CSV Export Error:', error);
      showNotification('Error exporting CSV', 'error');
    }
  };

  // Export filtered users
  const handleExportFiltered = () => {
    const filtered = filteredUsers;
    const csvData = [
      ['Filtered Users Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Filters:', `Domain: ${selectedRole}, Status: ${selectedStatus}, Search: ${searchTerm || 'None'}`],
      [],
      ['Name', 'Email', 'Domain', 'Status', 'Projects'],
      ...filtered.map(u => [u.name, u.email, u.domain, u.status, u.projects])
    ];

    const csvContent = csvData.map(row =>
      row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `filtered-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Filtered users exported!');
  };

  const getDomainColor = (domain) => {
    const colors = {
      'Healthcare': '#ef4444',
      'Agriculture': '#10b981',
      'Environment': '#14b8a6',
      'Education': '#f59e0b',
      'Research': '#8b5cf6'
    };
    return colors[domain] || '#6b7280';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.domain === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Initial load
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUsers, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="users-wrapper">
      <div className="users-container">
        {/* Notification */}
        {notification.show && (
          <div className={`admin-notification ${notification.type}`}>
            {notification.type === 'success' ? <Check size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
            <span className="notification-text">{notification.message}</span>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="users-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalType === 'view' && 'User Profile'}
                  {modalType === 'edit' && 'Edit User'}
                  {modalType === 'delete' && 'Delete User'}
                </h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {modalType === 'view' && selectedUser && (
                  <>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Full Name</p>
                      <p className="profile-detail-value">{selectedUser.name}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Email</p>
                      <p className="profile-detail-value">{selectedUser.email}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Role</p>
                      <p className="profile-detail-value">{selectedUser.role}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Domain</p>
                      <p className="profile-detail-value">{selectedUser.domain}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Phone</p>
                      <p className="profile-detail-value">{selectedUser.phone}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Location</p>
                      <p className="profile-detail-value">{selectedUser.location}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Projects</p>
                      <p className="profile-detail-value">{selectedUser.projects} total ({selectedUser.completedProjects} completed, {selectedUser.ongoingProjects} ongoing)</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Subscription</p>
                      <p className="profile-detail-value">{selectedUser.subscription}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Bio</p>
                      <p className="profile-detail-value">{selectedUser.bio}</p>
                    </div>
                    <div className="profile-detail">
                      <p className="profile-detail-label">Status</p>
                      <p className="profile-detail-value" style={{ color: selectedUser.status === 'active' ? '#10b981' : '#ef4444', fontWeight: '800' }}>{selectedUser.status.toUpperCase()}</p>
                    </div>
                  </>
                )}

                {modalType === 'edit' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input
                        className="form-input"
                        type="text"
                        value={editForm.role || ''}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Domain</label>
                      <select
                        className="form-select"
                        value={editForm.domain || ''}
                        onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Environment">Environment</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-input"
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        className="form-input"
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={editForm.status || ''}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'delete' && selectedUser && (
                  <div>
                    <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '1.5rem' }}>
                      Are you sure you want to delete <strong style={{ color: '#1e293b' }}>{selectedUser.name}</strong>?
                    </p>
                    <div style={{ padding: '1rem', background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '12px' }}>
                      <p style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '600', margin: 0 }}>
                        ⚠️ This action cannot be undone. All user data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="action-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                {modalType === 'edit' && (
                  <button className="action-btn primary" onClick={handleUpdateUser}>
                    <Check size={18} />
                    Save Changes
                  </button>
                )}
                {modalType === 'delete' && (
                  <button className="action-btn danger" onClick={confirmDeleteUser}>
                    <Trash2 size={18} />
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div>
              <div className="header-left">
                <div className="header-icon">
                  <Users style={{ width: '36px', height: '36px', color: 'white' }} />
                </div>
                <div>
                  <h1 className="header-title">User Management</h1>
                  <p className="header-subtitle">Track and manage registered users across all domains</p>
                  <p className="last-update">Last updated: {lastUpdate.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={handleExportCSV}>
                <Download size={20} />
                Export All
              </button>
              <button className="action-btn" onClick={handleExportFiltered}>
                <Download size={20} />
                Export Filtered
              </button>
              <button
                className="action-btn primary"
                onClick={fetchUsers}
                disabled={isLoading}
              >
                <RefreshCw className={`refresh-icon ${isLoading ? 'spinning' : ''}`} size={20} />
                {isLoading ? 'Updating...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <Users style={{ width: '36px', height: '36px', color: '#3b82f6' }} />
            </div>
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
            <p className="stat-subtext">
              <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px', color: '#10b981' }} />
              {stats.newUsersToday} new today
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Activity style={{ width: '36px', height: '36px', color: '#10b981' }} />
            </div>
            <p className="stat-label">Active Users</p>
            <p className="stat-value">{stats.activeUsers}</p>
            <p className="stat-subtext">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% active rate</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Award style={{ width: '36px', height: '36px', color: '#f59e0b' }} />
            </div>
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{stats.totalProjects}</p>
            <p className="stat-subtext">{(stats.totalProjects / stats.totalUsers).toFixed(1)} avg per user</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <MapPin style={{ width: '36px', height: '36px', color: '#8b5cf6' }} />
            </div>
            <p className="stat-label">Active Domains</p>
            <p className="stat-value">{stats.uniqueDomains}</p>
            <p className="stat-subtext">Healthcare, Agriculture, Environment</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="search-filter-section">
          <div className="search-filter-container">
            <div className="search-wrapper">
              <Search className="search-icon" style={{ width: '20px', height: '20px' }} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <p className="filter-label">
                <Filter size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Filter by Domain
              </p>
              <div className="filter-buttons">
                <button
                  onClick={() => setSelectedRole('all')}
                  className={`filter-btn ${selectedRole === 'all' ? 'active' : 'inactive'}`}
                >
                  All Domains
                </button>
                {['Healthcare', 'Agriculture', 'Environment'].map(domain => (
                  <button
                    key={domain}
                    onClick={() => setSelectedRole(domain)}
                    className={`filter-btn ${selectedRole === domain ? 'active' : 'inactive'}`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <p className="filter-label">Filter by Status</p>
              <div className="filter-buttons">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`filter-btn ${selectedStatus === 'all' ? 'active' : 'inactive'}`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setSelectedStatus('active')}
                  className={`filter-btn ${selectedStatus === 'active' ? 'active' : 'inactive'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedStatus('inactive')}
                  className={`filter-btn ${selectedStatus === 'inactive' ? 'active' : 'inactive'}`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <div className="user-info">
                    <div className="user-avatar" style={{ backgroundColor: getDomainColor(user.domain) }}>
                      {user.avatar || getInitials(user.name)}
                    </div>
                    <div className="user-details">
                      <h3>{user.name}</h3>
                      <p>{user.role}</p>
                    </div>
                  </div>
                  <div className={`status-indicator ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}></div>
                </div>

                <div className="user-contact">
                  <div className="contact-item">
                    <Mail style={{ width: '18px', height: '18px' }} />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="contact-item">
                      <Phone style={{ width: '18px', height: '18px' }} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="contact-item">
                      <MapPin style={{ width: '18px', height: '18px' }} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="projects-badge">
                  <div className="projects-info">
                    <p>Active Projects</p>
                    <p>{user.projects}</p>
                  </div>
                  <Award style={{ width: '44px', height: '44px', color: '#f59e0b' }} />
                </div>

                <div className="user-actions">
                  <button className="user-action-btn view" onClick={() => handleViewProfile(user)}>
                    <Eye size={16} />
                    View
                  </button>
                  <button className="user-action-btn edit" onClick={() => handleEditUser(user)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="user-action-btn delete" onClick={() => handleDeleteUser(user)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <div className="user-footer">
                  <span className="join-date">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className={`toggle-status-btn ${user.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => toggleUserStatus(user)}
                  >
                    {user.status === 'active' ? <Ban size={14} /> : <Check size={14} />}
                    {user.status === 'active' ? ' Deactivate' : ' Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AlertCircle className="empty-icon" />
            <p className="empty-text">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
