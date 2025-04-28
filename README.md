# University Attendance System

A comprehensive attendance management system for universities with features for students, parents, faculty, and administrators.

## Features

- Student login to view attendance
- Parent login to view student attendance and submit leave applications
- Faculty login to mark attendance and manage leave applications
- Admin login to manage users and courses
- Responsive web interface
- Secure authentication system

## Tech Stack

- Backend: Python Flask
- Frontend: HTML, CSS, JavaScript
- Database: MongoDB
- Deployment: Vercel

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd attendance-system
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
SECRET_KEY=your-secret-key
MONGODB_URI=your-mongodb-connection-string
```

## Deployment on Vercel

1. Create a Vercel account if you haven't already
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy the application:
```bash
vercel
```

5. Set up environment variables in the Vercel dashboard:
- Go to your project settings
- Add the following environment variables:
  - SECRET_KEY
  - MONGODB_URI

## API Endpoints

- POST /api/login - User login
- GET /api/attendance/<student_id> - Get student attendance
- POST /api/leave - Submit leave application
- PUT /api/leave/<leave_id> - Update leave status
- POST /api/attendance - Mark attendance
- GET /api/courses - Get courses (faculty only)
- GET /api/leave-applications - Get leave applications (faculty only)

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "password_hash": String,
  "role": String,
  "student_id": ObjectId,
  "faculty_id": ObjectId
}
```

### Students Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "roll_number": String,
  "parent_id": ObjectId
}
```

### Faculty Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "department": String
}
```

### Courses Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "faculty_id": ObjectId
}
```

### Attendance Collection
```json
{
  "_id": ObjectId,
  "student_id": ObjectId,
  "course_id": ObjectId,
  "date": Date,
  "status": String,
  "marked_by": ObjectId
}
```

### Leave Applications Collection
```json
{
  "_id": ObjectId,
  "student_id": ObjectId,
  "start_date": Date,
  "end_date": Date,
  "reason": String,
  "status": String,
  "faculty_id": ObjectId
}
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
