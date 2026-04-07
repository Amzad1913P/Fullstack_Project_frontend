import React, { useState, useEffect } from 'react';
import { listEnrollments } from '../api';
import { useUser } from '../context/UserContext';
import './Timetable.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Timetable = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const studentId = user ? user.id : null;

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  useEffect(() => {
    if (studentId) {
      fetchEnrollments();
    } else if (user) {
        setLoading(false);
    }
  }, [studentId, user]);

  const fetchEnrollments = async () => {
    try {
      const data = await listEnrollments(studentId);
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const courseOnDay = (enrollment, dayIndex) => {
    // Days are stored on the course object
    const binaryDays = enrollment.course?.days || "000000";
    return binaryDays.charAt(dayIndex) === '1';
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  if (loading) return <div className="loader">Loading timetable...</div>;

  return (
    <div className="timetable-page">
      <div className="page-header">
        <h1>My Weekly Timetable</h1>
        <p>A visual representation of your enrolled classes.</p>
      </div>

      {!user ? (
        <div className="glass-panel error-state">
          <p>Please log in to view your timetable.</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No classes scheduled. Enroll in courses to build your timetable.</p>
        </div>
      ) : (
        <div className="timetable-grid glass-panel horizontal-layout">
          <div className="timetable-header">
            <div className="day-name-col">Day / Time</div>
            {timeSlots.map(time => (
              <div key={time} className="time-header-col">{time}</div>
            ))}
          </div>

          <div className="timetable-body">
            {daysOfWeek.map((day, dayIndex) => (
              <div key={dayIndex} className="timetable-row">
                <div className="day-label-cell">{day}</div>
                
                {timeSlots.map((timeSlot, timeIndex) => {
                  const slotMinutes = parseTimeToMinutes(timeSlot);
                  
                  // Find course active during this 1-hour slot
                  const enrollmentThisSlot = enrollments.find(e => {
                    if (!courseOnDay(e, dayIndex)) return false;
                    const start = parseTimeToMinutes(e.course?.startTime);
                    const end = parseTimeToMinutes(e.course?.endTime);
                    return start <= slotMinutes && end > slotMinutes;
                  });

                  return (
                    <div key={timeIndex} className="course-cell">
                      {enrollmentThisSlot ? (
                        <div className="scheduled-course">
                          <span className="course-name">{enrollmentThisSlot.course?.name || 'Course'}</span>
                          <span className="course-time">
                            {enrollmentThisSlot.course?.startTime?.substring(0, 5)} - {enrollmentThisSlot.course?.endTime?.substring(0, 5)}
                          </span>
                        </div>
                      ) : (
                        <div className="empty-cell"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
