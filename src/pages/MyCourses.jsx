import React, { useState, useEffect } from 'react';
import { listEnrollments } from '../api';
import { useUser } from '../context/UserContext';
import './MyCourses.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();
  const studentId = user ? user.id : null;

  useEffect(() => {
    if (studentId) {
      fetchEnrollments();
    }
  }, [studentId]);

  const fetchEnrollments = async () => {
    try {
      const data = await listEnrollments(studentId);
      setEnrollments(data);
    } catch (err) {
      setError('Failed to fetch enrolled courses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-courses-page">
      <div className="page-header">
        <h1>My Enrollments</h1>
        <p>Your current active courses and schedule for the semester.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loader">Loading your schedule...</div>
      ) : enrollments.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>You are not enrolled in any courses presently.</p>
          <a href="/student/available-courses" className="btn-primary mt-4">Find Courses</a>
        </div>
      ) : (
        <div className="enrolled-list">
          {enrollments.map((enrollment, idx) => {
            const courseDetails = enrollment.course || {};
            return (
              <div key={idx} className="enrolled-card glass-panel">
                <div className="card-top">
                  <h3>{courseDetails.name || 'Unknown Course'}</h3>
                  <span className="status-badge">Active</span>
                </div>
                <div className="card-body">
                  <div className="info-group">
                    <span className="label">Instructor</span>
                    <span className="value">{courseDetails.facultyName || 'TBA'}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">Schedule</span>
                    <span className="value">{courseDetails.days} • {courseDetails.startTime?.substring(0, 5)} - {courseDetails.endTime?.substring(0, 5)}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">Credits</span>
                    <span className="value">{courseDetails.credits || '-'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
