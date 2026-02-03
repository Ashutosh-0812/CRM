import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import LeadList from './components/Leads/LeadList';
import LeadForm from './components/Leads/LeadForm';
import UserManagement from './components/UserManagement';
import Layout from './components/Layout/Layout';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <Layout>
                  <CustomerList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customers/new" element={
              <ProtectedRoute>
                <Layout>
                  <CustomerForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customers/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <CustomerForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute>
                <Layout>
                  <LeadList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/leads/new" element={
              <ProtectedRoute>
                <Layout>
                  <LeadForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/leads/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <LeadForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </AdminRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
