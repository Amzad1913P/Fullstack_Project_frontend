import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApiDocs from './pages/ApiDocs';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useUser();

  if (loading) return <div className="loader">Verifying session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

function AppContent() {
  const { user } = useUser();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          user ? (user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/student" />) : <Navigate to="/login" />
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/api-docs" element={<ApiDocs />} />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <PrivateRoute role="STUDENT">
            <StudentDashboard />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
