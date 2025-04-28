from flask import Flask, request, jsonify, send_from_directory, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__, static_folder='static')

# Configure session
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Configure CORS
CORS(app, 
     supports_credentials=True,
     resources={
         r"/api/*": {
             "origins": ["*"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     })

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
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        print("Login attempt:", data)  # Debug log
        
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'message': 'Missing username or password'}), 400
        
        user_data = users.find_one({'username': data['username']})
        print("User data found:", user_data)  # Debug log
        
        if user_data and check_password_hash(user_data['password_hash'], data['password']):
            user = User(user_data)
            login_user(user, remember=True)
            session.permanent = True
            return jsonify({
                'message': 'Login successful',
                'role': user.role,
                'user_id': str(user.id)
            })
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print("Login error:", str(e))  # Debug log
        return jsonify({'message': 'An error occurred during login'}), 500

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
@login_required
def logout():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        logout_user()
        session.clear()
        return jsonify({'message': 'Logged out successfully'})
    except Exception as e:
        print("Logout error:", str(e))  # Debug log
        return jsonify({'message': 'An error occurred during logout'}), 500

# ... rest of the existing code ...