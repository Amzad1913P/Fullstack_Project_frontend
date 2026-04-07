import React, { useState, useEffect } from 'react';
import { listEnrollments } from '../api';
import { useUser } from '../context/UserContext';
import './DashboardHome.css';

const DashboardHome = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const studentName = user ? user.name : 'Student';
  const studentId = user ? user.id : null;

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        const data = await listEnrollments(studentId);
        setEnrollments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [studentId]);

  return (
    <div className="dashboard-home">
      <div className="welcome-banner glass-panel">
        <div className="banner-content">
          <h1>Welcome back, <span>{studentName}</span>!</h1>
          <p>Here's an overview of your academic timetable and upcoming courses.</p>
        </div>
        <div className="banner-illustration">
          🎓
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon courses-icon">📚</div>
          <div className="stat-info">
            <h3>Enrolled Courses</h3>
            <p className="stat-number">{loading ? '-' : enrollments.length}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon credits-icon">⭐</div>
          <div className="stat-info">
            <h3>Total Credits</h3>
            <p className="stat-number">
              {loading ? '-' : enrollments.reduce((acc, enrollment) => acc + (enrollment.course?.credits || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="recent-activity glass-panel">
        <h2>Your Active Courses</h2>
        {loading ? (
          <div className="loader">Loading courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="empty-state">
            <p>You haven't enrolled in any courses yet.</p>
            <a href="/student/available-courses" className="btn-primary mt-4">Browse Courses</a>
          </div>
        ) : (
          <ul className="activity-list">
            {enrollments.slice(0, 3).map((enrollment, index) => {
              const course = enrollment.course || {};
              return (
                <li key={index} className="activity-item">
                  <div className="activity-icon">📘</div>
                  <div className="activity-details">
                    <h4>{course.name}</h4>
                    <p>{course.facultyName} • {course.days} • {course.startTime?.substring(0, 5)}</p>
                  </div>
                  <div className="activity-credits">{course.credits} Cr</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
