import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/customers', label: 'Customers' },
    { path: '/leads', label: 'Leads' },
    ...(user?.role === 'admin' ? [{ path: '/admin/users', label: 'User Management' }] : []),
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="nav-brand">CRM System</div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end={item.exact}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="header-actions">
            <span className="user-info">Welcome, {user?.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Dashboard',
    '/customers': 'Customer Management',
    '/customers/new': 'Add New Customer',
    '/leads': 'Lead Management',
    '/leads/new': 'Add New Lead',
    '/admin/users': 'User Management',
  };

  // Handle edit routes
  if (pathname.includes('/customers/') && pathname.includes('/edit')) {
    return 'Edit Customer';
  }
  if (pathname.includes('/leads/') && pathname.includes('/edit')) {
    return 'Edit Lead';
  }

  return titles[pathname] || 'CRM System';
};

export default Layout;