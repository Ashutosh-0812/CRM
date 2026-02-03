import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadAPI } from '../../services/api';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
      });
      setLeads(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      setError('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(leadId);
        fetchLeads(); // Refresh the list
      } catch (error) {
        setError('Failed to delete lead');
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#666666',
      contacted: '#888888',
      qualified: '#aaaaaa',
      converted: '#ffffff',
      lost: '#444444',
    };
    return colors[status] || '#666666';
  };

  if (loading && leads.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Lead Management</h1>
        <Link to="/leads/new" className="btn btn-primary">
          Add New Lead
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div className="search-container" style={{ margin: 0 }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <select
          className="form-input"
          value={statusFilter}
          onChange={handleStatusFilter}
          style={{ width: '200px' }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Lead Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || 'N/A'}</td>
                  <td>{lead.company || 'N/A'}</td>
                  <td>{lead.source || 'N/A'}</td>
                  <td>
                    <span 
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: getStatusColor(lead.status),
                        color: lead.status === 'converted' ? '#000000' : '#ffffff',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}
                    >
                      {lead.status || 'new'}
                    </span>
                  </td>
                  <td>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/leads/${lead.id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#cccccc', padding: '2rem' }}>
                  {searchTerm || statusFilter ? 'No leads found matching your criteria.' : 'No leads found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadList;