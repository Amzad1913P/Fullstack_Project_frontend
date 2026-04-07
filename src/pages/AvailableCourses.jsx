import React, { useState, useEffect } from 'react';
import { getAllCourses, enrollCourse, checkScheduleConflict } from '../api';
import { useUser } from '../context/UserContext';
import './AvailableCourses.css';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingMap, setEnrollingMap] = useState({});
  const { user } = useUser();
  const studentId = user ? user.id : null;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch available courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    if (!studentId) {
      setError('User data not available. Try refreshing.');
      return;
    }

    setEnrollingMap({...enrollingMap, [course.id]: true});
    setError('');

    try {
      // 1. Check for conflicts
      const conflictStatus = await checkScheduleConflict(studentId, course);
      if (conflictStatus.includes('Schedule Conflict Detected')) {
        setError(`Conflict detected for ${course.name}. Registration blocked.`);
        setEnrollingMap({...enrollingMap, [course.id]: false});
        return;
      }

      // 2. Enroll
      const result = await enrollCourse(studentId, course.id);
      alert(`Success: ${result}`);
      
    } catch (err) {
      setError('Enrollment failed. Please try again.');
    } finally {
      setEnrollingMap({...enrollingMap, [course.id]: false});
    }
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Available Courses</h1>
        <p>Browse and enroll in courses for the upcoming semester.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loader">Loading course catalog...</div>
      ) : courses.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No courses available at the moment.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card glass-panel">
              <div className="course-header">
                <h3>{course.name}</h3>
                <span className="credits-badge">{course.credits} Credits</span>
              </div>
              
              <div className="course-details">
                <div className="detail-row">
                  <span className="icon">👨‍🏫</span>
                  <span>{course.facultyName}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">📅</span>
                  <span>{course.days}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">⏰</span>
                  <span>{course.startTime} - {course.endTime}</span>
                </div>
              </div>
              
              <div className="course-actions">
                <button 
                  className="btn-primary enroll-btn" 
                  onClick={() => handleEnroll(course)}
                  disabled={enrollingMap[course.id]}
                >
                  {enrollingMap[course.id] ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
