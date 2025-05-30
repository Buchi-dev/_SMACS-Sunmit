# Student Monitoring and Attendance Control System (SMACS) - Server

This is the server-side application for the Student Monitoring and Attendance Control System (SMACS). The system is designed to help educational institutions manage and track student attendance efficiently.

## Features

- Authentication and authorization (JWT based)
- User management (admin, faculty, staff)
- Student management
- Faculty management
- Subject management
- Attendance tracking with NFC card support
- Attendance reports and analytics
- RESTful API endpoints

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/smacs.git
   cd smacs/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smacs
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Note: For production, update the `MONGO_URI` to your production MongoDB instance and set `NODE_ENV=production`.

## Database Setup

1. Make sure MongoDB is running on your system or you have access to a MongoDB cloud instance.
2. The application will automatically create the necessary collections when first run.

## Running the Application

### Development Mode

```
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Production Mode

```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/class/:className` - Get students by class
- `GET /api/students/subject/:subjectId` - Get students by subject
- `GET /api/students/nfc/:nfcId` - Get student by NFC ID

### Faculty
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get faculty by ID
- `POST /api/faculty` - Create new faculty
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `GET /api/subjects/faculty/:facultyId` - Get subjects by faculty ID
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/student/:studentId` - Get attendance by student ID
- `GET /api/attendance/subject/:subjectId` - Get attendance by subject ID
- `PUT /api/attendance/:id` - Update attendance record
- `GET /api/attendance/stats` - Get attendance statistics
- `GET /api/attendance/recent-checkins` - Get recent check-ins

### Reports
- `GET /api/reports/class/:className` - Get class report
- `GET /api/reports/subject/:subjectId` - Get subject report
- `GET /api/reports/student/:studentId` - Get student report
- `GET /api/reports/summary` - Get attendance summary
- `POST /api/reports/export` - Export report

## Error Handling

The API returns appropriate HTTP status codes along with JSON responses:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request or validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## License

This project is licensed under the MIT License. 