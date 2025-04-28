from flask import Flask, request, jsonify, send_from_directory
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')

# MongoDB connection
client = MongoClient('mongodb+srv://devloperasys:devloperasys@asys.6o7l3r1.mongodb.net/?retryWrites=true&w=majority&appName=asys')
db = client['attendance_system']

# Collections
users = db['users']
students = db['students']
faculty = db['faculty']
courses = db['courses']
attendance = db['attendance']
leave_applications = db['leave_applications']

login_manager = LoginManager()
login_manager.init_app(app)

# Serve static files
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.email = user_data['email']
        self.password_hash = user_data['password_hash']
        self.role = user_data['role']
        self.student_id = user_data.get('student_id')
        self.faculty_id = user_data.get('faculty_id')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    user_data = users.find_one({'_id': ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

# Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user_data = users.find_one({'username': data['username']})
    
    if user_data and check_password_hash(user_data['password_hash'], data['password']):
        user = User(user_data)
        login_user(user)
        return jsonify({'message': 'Login successful', 'role': user.role})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/attendance/<student_id>', methods=['GET'])
@login_required
def get_attendance(student_id):
    if current_user.role not in ['student', 'parent', 'faculty', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    attendances = list(attendance.find({'student_id': ObjectId(student_id)}))
    return jsonify([{
        'date': attendance['date'].strftime('%Y-%m-%d'),
        'status': attendance['status'],
        'course': courses.find_one({'_id': attendance['course_id']})['name']
    } for attendance in attendances])

@app.route('/api/leave', methods=['POST'])
@login_required
def apply_leave():
    if current_user.role != 'parent':
        return jsonify({'message': 'Only parents can apply for leave'}), 403
    
    data = request.get_json()
    leave = {
        'student_id': ObjectId(data['student_id']),
        'start_date': datetime.strptime(data['start_date'], '%Y-%m-%d'),
        'end_date': datetime.strptime(data['end_date'], '%Y-%m-%d'),
        'reason': data['reason'],
        'faculty_id': ObjectId(data['faculty_id']),
        'status': 'pending'
    }
    leave_applications.insert_one(leave)
    return jsonify({'message': 'Leave application submitted successfully'})

@app.route('/api/leave/<leave_id>', methods=['PUT'])
@login_required
def update_leave_status(leave_id):
    if current_user.role != 'faculty':
        return jsonify({'message': 'Only faculty can update leave status'}), 403
    
    data = request.get_json()
    leave_applications.update_one(
        {'_id': ObjectId(leave_id)},
        {'$set': {'status': data['status']}}
    )
    return jsonify({'message': 'Leave status updated successfully'})

@app.route('/api/attendance', methods=['POST'])
@login_required
def mark_attendance():
    if current_user.role != 'faculty':
        return jsonify({'message': 'Only faculty can mark attendance'}), 403
    
    data = request.get_json()
    attendance_record = {
        'student_id': ObjectId(data['student_id']),
        'course_id': ObjectId(data['course_id']),
        'date': datetime.strptime(data['date'], '%Y-%m-%d'),
        'status': data['status'],
        'marked_by': ObjectId(current_user.id)
    }
    attendance.insert_one(attendance_record)
    return jsonify({'message': 'Attendance marked successfully'})

@app.route('/api/courses', methods=['GET'])
@login_required
def get_courses():
    if current_user.role != 'faculty':
        return jsonify({'message': 'Unauthorized'}), 403
    
    faculty_courses = list(courses.find({'faculty_id': ObjectId(current_user.faculty_id)}))
    return jsonify([{
        'id': str(course['_id']),
        'name': course['name']
    } for course in faculty_courses])

@app.route('/api/leave-applications', methods=['GET'])
@login_required
def get_leave_applications():
    if current_user.role != 'faculty':
        return jsonify({'message': 'Unauthorized'}), 403
    
    applications = list(leave_applications.find({'faculty_id': ObjectId(current_user.faculty_id)}))
    return jsonify([{
        'id': str(app['_id']),
        'student_name': students.find_one({'_id': app['student_id']})['name'],
        'start_date': app['start_date'].strftime('%Y-%m-%d'),
        'end_date': app['end_date'].strftime('%Y-%m-%d'),
        'reason': app['reason'],
        'status': app['status']
    } for app in applications])

# Admin routes
@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    users_list = list(users.find({}, {'password_hash': 0}))
    return jsonify([{
        '_id': str(user['_id']),
        'username': user['username'],
        'email': user['email'],
        'role': user['role']
    } for user in users_list])

@app.route('/api/users', methods=['POST'])
@login_required
def create_user():
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Check if username or email already exists
    if users.find_one({'$or': [{'username': data['username']}, {'email': data['email']}]}):
        return jsonify({'message': 'Username or email already exists'}), 400
    
    new_user = {
        'username': data['username'],
        'email': data['email'],
        'password_hash': generate_password_hash(data['password']),
        'role': data['role']
    }
    
    result = users.insert_one(new_user)
    return jsonify({'message': 'User created successfully', 'id': str(result.inserted_id)})

@app.route('/api/users/<user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Don't allow deleting the admin user
    user_to_delete = users.find_one({'_id': ObjectId(user_id)})
    if user_to_delete and user_to_delete['role'] == 'admin':
        return jsonify({'message': 'Cannot delete admin user'}), 400
    
    result = users.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count:
        return jsonify({'message': 'User deleted successfully'})
    return jsonify({'message': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True) 