# Backend Documentation

## Features
- Employee management (CRUD)
- Attendance tracking (bulk/manual)
- Leave application and status
- Shift scheduling and management
- Payroll calculation (monthly/hourly)
- User management (roles, permissions)
- Secure authentication and authorization
- Email notifications

## Setup
1. Install dependencies:
   ```bash
   cd AS_BACK
   npm install
   ```
2. Configure your `.env` file with MongoDB URI and other secrets.
3. Start the backend server:
   ```bash
   npm start
   ```

## API Endpoints
- `/api/users` - User management
- `/api/employees` - Employee CRUD
- `/api/attendance` - Attendance tracking
- `/api/leave` - Leave requests
- `/api/payroll` - Payroll operations
- `/api/shifts` - Shift management

See route files in `AS_BACK/routes/` for details. (Full API docs in progress)

## Models
- Employee
- User
- Attendance
- LeaveRequest
- Payroll
- Shift
- AssignedShift

See `AS_BACK/models/` for schema details.

---

*This documentation is a work in progress and will be updated as the project evolves.* 