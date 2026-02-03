import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../../services/api';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchCustomer();
    }
  }, [id, isEditing]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getById(id);
      const customer = response.data.data;
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
        status: customer.status || 'active',
      });
    } catch (error) {
      setError('Failed to fetch customer details');
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await customerAPI.update(id, formData);
        setSuccess('Customer updated successfully!');
      } else {
        await customerAPI.create(formData);
        setSuccess('Customer created successfully!');
      }
      
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 
        (isEditing ? 'Failed to update customer' : 'Failed to create customer');
      setError(message);
      console.error('Error saving customer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.name) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading customer...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/customers')}
        >
          Back to Customers
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
                placeholder="Enter customer name"
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
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              className="form-input"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              style={{ resize: 'vertical' }}
            ></textarea>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
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
                isEditing ? 'Update Customer' : 'Create Customer'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/customers')}
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

export default CustomerForm;