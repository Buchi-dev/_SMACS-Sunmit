# Student Monitoring and Attendance Control System (SMACS)

A comprehensive system for monitoring student attendance using NFC cards, generating reports, and managing educational institution data.

## Overview

SMACS is a full-stack web application designed to help educational institutions manage and track student attendance efficiently. The system consists of a React-based frontend and a Node.js/Express backend with MongoDB database.

## Features

- User authentication with role-based access control (admin, faculty)
- Student management (add, edit, delete, search)
- Faculty management (add, edit, delete, search)
- Subject management (add, edit, delete, search)
- Attendance tracking with NFC card support
- Real-time attendance console
- Comprehensive reporting and analytics
- Responsive UI for all devices

## System Architecture

- **Frontend**: React.js with Ant Design UI components
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Context API
- **Data Fetching**: Custom hooks with Axios

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smacs.git
cd smacs
```

### 2. Setup the Server

```bash
cd server
npm install

# Create .env file with the following variables
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/smacs
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Start the server
npm run dev
```

### 3. Setup the Client

```bash
cd ../client
npm install

# Start the client
npm run dev
```

## Initial Setup

After installation, follow these steps to set up the system:

1. Register an admin user through the registration page
2. Log in with the admin credentials
3. Add faculty members, subjects, and students
4. Configure the subjects and assign them to faculty
5. Start tracking attendance

## NFC Setup (Optional)

To use NFC card functionality:

1. Acquire NFC cards and an NFC reader compatible with your system
2. Assign NFC IDs to students through the student management interface
3. Use the Attendance Console to scan NFC cards for marking attendance

## Usage Guide

### Admin Role

Admins have full access to the system including:
- User management
- Faculty management
- Student management
- Subject management
- All attendance records
- All reports

### Faculty Role

Faculty members have limited access:
- View/manage assigned subjects
- Mark attendance for their subjects
- Generate reports for their subjects
- View students enrolled in their subjects

## Production Deployment

For production deployment:

1. Build the React client:
   ```bash
   cd client
   npm run build
   ```

2. Set up proper environment variables for production
   ```
   NODE_ENV=production
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_strong_secret_key
   ```

3. Use a process manager like PM2 to run the server

## License

This project is licensed under the MIT License. 