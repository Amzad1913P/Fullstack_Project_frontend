import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DashboardHome from './DashboardHome';
import AvailableCourses from './AvailableCourses';
import MyCourses from './MyCourses';
import Timetable from './Timetable';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const studentName = user ? user.name : 'Student';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar glass-panel">
        <div className="sidebar-header">
          <h2>UniSched</h2>
          <span className="role-badge">Student</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/student" className={`nav-link ${location.pathname === '/student' ? 'active-link' : ''}`}>
            Dashboard Home
          </Link>
          <Link to="/student/available-courses" className={`nav-link ${isActive('/student/available-courses')}`}>
            Available Courses
          </Link>
          <Link to="/student/my-courses" className={`nav-link ${isActive('/student/my-courses')}`}>
            My Enrollments
          </Link>
          <Link to="/student/timetable" className={`nav-link ${isActive('/student/timetable')}`}>
            Timetable
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{studentName.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="name-text">{studentName}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="mobile-header glass-panel">
          <h2>UniSched</h2>
        </header>
        <div className="content-area">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="available-courses" element={<AvailableCourses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="timetable" element={<Timetable />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
