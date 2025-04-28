from pymongo import MongoClient
from werkzeug.security import generate_password_hash

# MongoDB connection
client = MongoClient('mongodb+srv://devloperasys:devloperasys@asys.6o7l3r1.mongodb.net/?retryWrites=true&w=majority&appName=asys')
db = client['attendance_system']
users = db['users']

# Admin user data
admin_user = {
    'username': 'admin@asys.com',
    'email': 'admin@asys.com',
    'password_hash': generate_password_hash('Bdhpj@7747'),
    'role': 'admin'
}

# Check if admin already exists
existing_admin = users.find_one({'username': admin_user['username']})
if existing_admin:
    print('Admin user already exists')
else:
    # Insert admin user
    result = users.insert_one(admin_user)
    print(f'Admin user created successfully with ID: {result.inserted_id}') 