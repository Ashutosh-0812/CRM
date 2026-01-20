# CRM Backend - Quick Start Guide

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MySQL installed and running (v5.7+)
- ✅ MySQL root password ready

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Environment Variables

The `.env` file has been created. Update these values:

```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_random_secret_key
```

### Step 2: Create Database

Open MySQL and run:

```bash
mysql -u root -p
```

Then execute:

```sql
CREATE DATABASE crm_db;
exit;
```

### Step 3: Initialize Database Tables

```bash
node setup-db.js
```

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

Server will start at: http://localhost:3000

### Step 5: Test the API

Visit: http://localhost:3000/health

You should see:
```json
{
  "status": "OK",
  "message": "CRM Backend is running"
}
```

## 🎯 Next Steps

### 1. Register a User

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@crm.com",
  "password": "admin123",
  "role": "admin"
}
```

### 2. Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@crm.com",
  "password": "admin123"
}
```

Copy the `token` from the response.

### 3. Create a Customer

```bash
POST http://localhost:3000/api/customers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "status": "active"
}
```

### 4. Get All Customers

```bash
GET http://localhost:3000/api/customers?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📚 API Testing Tools

Use any of these tools to test the API:
- **Postman** - Download: https://www.postman.com/downloads/
- **Thunder Client** - VS Code extension
- **curl** - Command line
- **REST Client** - VS Code extension

## 🐛 Troubleshooting

### Database Connection Error

If you see "Database connection failed":
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `.env` file
3. Ensure database `crm_db` exists

### Port Already in Use

If port 3000 is busy, change it in `.env`:
```env
PORT=3001
```

### Module Not Found

Run:
```bash
npm install
```

## 📁 Project Structure

```
src/
├── config/         - Database configuration
├── controllers/    - Business logic
├── middleware/     - Auth, validation, error handling
├── models/         - Database models
├── routes/         - API routes
├── validators/     - Input validation rules
└── utils/          - Logger and utilities
```

## 📖 Full Documentation

See [README.md](README.md) for complete API documentation.

---

Need help? Check the logs in `logs/` directory.
