import React, { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent, registerStudent } from '../api';
import './AdminStudents.css';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollno: '', email: '', password: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(newStudent);
      setNewStudent({ name: '', rollno: '', email: '', password: '' });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setError('Failed to add student. Please check the details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? All their enrollments will also be removed.')) return;
    
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete student.');
    }
  };

  return (
    <div className="admin-students-page">
      <div className="page-header student-header">
        <div>
          <h1>Student Management</h1>
          <p>Register new students or manage existing roster entries.</p>
        </div>
        <button 
          className={`btn-action ${showForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel add-student-form">
          <h3>Register New Student</h3>
          <form onSubmit={handleAddStudent} className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={newStudent.name}
                onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input 
                type="text" 
                required 
                value={newStudent.rollno}
                onChange={e => setNewStudent({...newStudent, rollno: e.target.value})}
                placeholder="21XXXXXX"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={newStudent.email}
                onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                placeholder="student@university.edu"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                value={newStudent.password}
                onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                placeholder="Temporary Password"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Student Record</button>
            </div>
          </form>
        </div>
      )}

      {error ? (
        <div className="error-banner">{error}</div>
      ) : loading ? (
        <div className="loader">Loading student database...</div>
      ) : students.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No students are currently registered in the database.</p>
        </div>
      ) : (
        <div className="glass-panel table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td className="font-mono">{student.rollno}</td>
                  <td className="font-medium">{student.name}</td>
                  <td><a href={`mailto:${student.email}`}>{student.email}</a></td>
                  <td><span className="badge-active">Active</span></td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(student.id)}
                      title="Delete Student"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
