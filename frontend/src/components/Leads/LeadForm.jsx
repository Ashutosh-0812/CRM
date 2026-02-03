import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadAPI } from '../../services/api';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new',
    notes: '',
    assigned_to: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchLead();
    }
  }, [id, isEditing]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getById(id);
      const lead = response.data.data;
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || '',
        status: lead.status || 'new',
        notes: lead.notes || '',
        assigned_to: lead.assigned_to || null,
      });
    } catch (error) {
      setError('Failed to fetch lead details');
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.value ? parseInt(e.target.value) : null) : 
      e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await leadAPI.update(id, formData);
        setSuccess('Lead updated successfully!');
      } else {
        await leadAPI.create(formData);
        setSuccess('Lead created successfully!');
      }
      
      setTimeout(() => {
        navigate('/leads');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 
        (isEditing ? 'Failed to update lead' : 'Failed to create lead');
      setError(message);
      console.error('Error saving lead:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.name) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading lead...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Edit Lead' : 'Add New Lead'}
        </h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/leads')}
        >
          Back to Leads
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter lead name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="company">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-input"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="source">
                Lead Source
              </label>
              <select
                id="source"
                name="source"
                className="form-input"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="social_media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="trade_show">Trade Show</option>
                <option value="cold_call">Cold Call</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="assigned_to">
              Assigned To (User ID)
            </label>
            <input
              type="number"
              id="assigned_to"
              name="assigned_to"
              className="form-input"
              placeholder="Enter user ID "
              value={formData.assigned_to || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              placeholder="Enter any additional notes about this lead"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                isEditing ? 'Update Lead' : 'Create Lead'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/leads')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;