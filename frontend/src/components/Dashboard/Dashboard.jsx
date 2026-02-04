import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI, leadAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    newLeadsToday: 0,
    activeCustomers: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [setStats]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch customers
      const customersResponse = await customerAPI.getAll({ page: 1, limit: 1000 });
      const customers = customersResponse.data.data || [];
      
      // Fetch leads
      const leadsResponse = await leadAPI.getAll({ page: 1, limit: 1000 });
      const leads = leadsResponse.data.data || [];
      
      // Calculate stats
      const totalCustomers = customers.length;
      const totalLeads = leads.length;
      const activeCustomers = customers.filter(c => c.status === 'active').length;
      
      // Get today's date for filtering new leads
      const today = new Date().toISOString().split('T')[0];
      const newLeadsToday = leads.filter(lead => {
        const leadDate = new Date(lead.created_at).toISOString().split('T')[0];
        return leadDate === today;
      }).length;
      
      setStats({
        totalCustomers,
        totalLeads,
        newLeadsToday,
        activeCustomers,
      });
      
      // Get recent leads (last 5)
      const sortedLeads = leads
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentLeads(sortedLeads);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.totalCustomers}</span>
          <span className="stat-label">Total Customers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.activeCustomers}</span>
          <span className="stat-label">Active Customers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalLeads}</span>
          <span className="stat-label">Total Leads</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.newLeadsToday}</span>
          <span className="stat-label">New Leads Today</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Leads */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Leads</h3>
            <Link to="/leads" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          {recentLeads.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.name}</td>
                      <td>{lead.company || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${lead.status}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#cccccc', textAlign: 'center', padding: '2rem' }}>
              No recent leads found.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/customers/new" className="btn btn-primary">
              Add New Customer
            </Link>
            <Link to="/leads/new" className="btn btn-primary">
              Add New Lead
            </Link>
            <Link to="/customers" className="btn btn-secondary">
              Manage Customers
            </Link>
            <Link to="/leads" className="btn btn-secondary">
              Manage Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;