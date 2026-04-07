//const API_BASE = ''; // Proxy handles routing to localhost:8080
//const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = import.meta.env.VITE_API_URL || '';
const handleResponse = async (res) => {
    if (res.status === 401 || res.status === 403) {
        // Token expired or unauthorized
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
    }
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return res.json();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Authentication
export const loginStudent = async (email, password, captchaToken) => {
    const res = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken })
    });
    return handleResponse(res);
};

export const loginAdmin = async (email, password, captchaToken) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken })
    });
    return handleResponse(res);
};

export const getProfile = async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
};

export const deleteStudent = async (id) => {
    const res = await fetch(`${API_BASE}/student/delete/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
    });
    return res.text();
};

export const getGoogleLoginUrl = () => {
    return `${API_BASE}/oauth2/authorization/google`;
};

// Students
export const registerStudent = async (student) => {
    const res = await fetch(`${API_BASE}/student/add`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    return handleResponse(res);
};

export const getAllStudents = async () => {
    const res = await fetch(`${API_BASE}/student/all`, {
        headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
};

// Courses
export const getAllCourses = async () => {
    const res = await fetch(`${API_BASE}/course/all`, {
        headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
};

export const addCourse = async (course) => {
    const res = await fetch(`${API_BASE}/course/add`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(course)
    });
    return handleResponse(res);
};

export const deleteCourse = async (courseId) => {
    const res = await fetch(`${API_BASE}/course/delete/${courseId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
    });
    if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    if (!res.ok) throw new Error('Failed to delete course');
    return res.text();
};

// Enrollments
export const enrollCourse = async (studentId, courseId) => {
    const res = await fetch(`${API_BASE}/enrollment/add?studentId=${studentId}&courseId=${courseId}`, {
        method: 'POST',
        headers: { ...getAuthHeaders() }
    });
    if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    if (!res.ok) throw new Error('Enrollment failed');
    return res.text();
};

export const listEnrollments = async (studentId) => {
    if (!studentId) return [];
    const res = await fetch(`${API_BASE}/enrollment/list?studentId=${studentId}`, {
        headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
};

// Scheduling
export const checkScheduleConflict = async (studentId, course) => {
    const res = await fetch(`${API_BASE}/schedule/check?studentId=${studentId}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(course)
    });
    if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    if (!res.ok) throw new Error('Conflict check failed');
    return res.text();
};
