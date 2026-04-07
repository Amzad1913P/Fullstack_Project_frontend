import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AdminHome from './AdminHome';
import AddCourseForm from './AddCourseForm';
import AdminStudents from './AdminStudents';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const adminName = user ? user.name : 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <div className="dashboard-layout admin-layout">
      <aside className="dashboard-sidebar glass-panel admin-sidebar">
        <div className="sidebar-header">
          <h2>UniSched</h2>
          <span className="role-badge admin-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active-link' : ''}`}>
            Admin Overview
          </Link>
          <Link to="/admin/students" className={`nav-link ${isActive('/admin/students')}`}>
            Manage Students
          </Link>
          <Link to="/admin/add-course" className={`nav-link ${isActive('/admin/add-course')}`}>
            Add New Course
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="name-text">{adminName}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="mobile-header glass-panel admin-mobile-header">
          <h2>UniSched Admin</h2>
        </header>
        <div className="content-area">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="add-course" element={<AddCourseForm />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
