// Global variables
let currentUser = null;
let currentRole = null;
let currentUserId = null;

// Check if user is already logged in
function checkLoginStatus() {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (userRole && userId) {
        currentRole = userRole;
        currentUserId = userId;
        showDashboard();
    }
}

// Login function
async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Attempting login with:', { username }); // Debug log

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
            mode: 'cors'
        });

        console.log('Login response status:', response.status); // Debug log

        const data = await response.json();
        console.log('Login response data:', data); // Debug log

        if (response.ok) {
            currentUser = username;
            currentRole = data.role;
            currentUserId = data.user_id;
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data.user_id);
            showDashboard();
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        });

        if (response.ok) {
            currentUser = null;
            currentRole = null;
            currentUserId = null;
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('studentDashboard').style.display = 'none';
            document.getElementById('parentDashboard').style.display = 'none';
            document.getElementById('facultyDashboard').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('userInfo').style.display = 'none';
        } else {
            const data = await response.json();
            alert(data.message || 'Error during logout');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
    }
}

// Show appropriate dashboard based on user role
function showDashboard() {
    console.log('Showing dashboard for role:', currentRole); // Debug log

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userRole').textContent = `Logged in as ${currentRole}`;

    // Hide all dashboards first
    document.getElementById('studentDashboard').style.display = 'none';
    document.getElementById('parentDashboard').style.display = 'none';
    document.getElementById('facultyDashboard').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'none';

    // Show the appropriate dashboard
    switch (currentRole) {
        case 'student':
            document.getElementById('studentDashboard').style.display = 'block';
            loadStudentAttendance();
            break;
        case 'parent':
            document.getElementById('parentDashboard').style.display = 'block';
            loadStudentAttendance();
            break;
        case 'faculty':
            document.getElementById('facultyDashboard').style.display = 'block';
            loadCourses();
            loadLeaveApplications();
            break;
        case 'admin':
            document.getElementById('adminDashboard').style.display = 'block';
            loadUsers();
            break;
        default:
            console.error('Unknown role:', currentRole);
            alert('Unknown user role. Please contact support.');
            break;
    }
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Load student attendance
async function loadStudentAttendance() {
    try {
        const response = await fetch(`/api/attendance/${currentUser}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        const attendanceList = document.getElementById('attendanceList');
        attendanceList.innerHTML = '';

        data.forEach(attendance => {
            const row = document.createElement('div');
            row.className = 'row mb-2';
            row.innerHTML = `
                <div class="col">${attendance.date}</div>
                <div class="col">${attendance.course}</div>
                <div class="col">${attendance.status}</div>
            `;
            attendanceList.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading attendance data');
    }
}

// Apply for leave
async function applyLeave(event) {
    event.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;

    try {
        const response = await fetch('/api/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                student_id: currentUser,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
                faculty_id: 1 // This should be dynamically set based on the course
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Leave application submitted successfully');
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            document.getElementById('reason').value = '';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting leave application');
    }
}

// Load courses for faculty
async function loadCourses() {
    try {
        const response = await fetch('/api/courses', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        const courseSelect = document.getElementById('course');
        courseSelect.innerHTML = '';

        data.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading courses');
    }
}

// Mark attendance
async function markAttendance(event) {
    event.preventDefault();
    const courseId = document.getElementById('course').value;
    const date = document.getElementById('attendanceDate').value;
    const students = document.querySelectorAll('.student-attendance');

    try {
        for (const student of students) {
            const studentId = student.dataset.studentId;
            const status = student.querySelector('select').value;

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseId,
                    date: date,
                    status: status
                }),
            });

            if (!response.ok) {
                throw new Error('Error marking attendance');
            }
        }

        alert('Attendance marked successfully');
        document.getElementById('attendanceDate').value = '';
        document.getElementById('studentList').innerHTML = '';
    } catch (error) {
        console.error('Error:', error);
        alert('Error marking attendance');
    }
}

// Load leave applications for faculty
async function loadLeaveApplications() {
    try {
        const response = await fetch('/api/leave-applications', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        const leaveList = document.getElementById('leaveApplicationsList');
        leaveList.innerHTML = '';

        data.forEach(leave => {
            const row = document.createElement('div');
            row.className = 'card mb-2';
            row.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Student: ${leave.student_name}</h5>
                    <p class="card-text">From: ${leave.start_date} To: ${leave.end_date}</p>
                    <p class="card-text">Reason: ${leave.reason}</p>
                    <p class="card-text">Status: ${leave.status}</p>
                    ${leave.status === 'pending' ? `
                        <button class="btn btn-success" onclick="updateLeaveStatus(${leave.id}, 'approved')">Approve</button>
                        <button class="btn btn-danger" onclick="updateLeaveStatus(${leave.id}, 'denied')">Deny</button>
                    ` : ''}
                </div>
            `;
            leaveList.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading leave applications');
    }
}

// Update leave status
async function updateLeaveStatus(leaveId, status) {
    try {
        const response = await fetch(`/api/leave/${leaveId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            alert('Leave status updated successfully');
            loadLeaveApplications();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating leave status');
    }
}

// Admin functions
async function loadUsers() {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            userList.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading users');
    }
}

async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('userRole').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role
            }),
        });

        if (response.ok) {
            alert('User added successfully');
            document.getElementById('newUsername').value = '';
            document.getElementById('newEmail').value = '';
            document.getElementById('newPassword').value = '';
            loadUsers();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            alert('User deleted successfully');
            loadUsers();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting user');
    }
} 