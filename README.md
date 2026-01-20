# CRM Backend - MySQL with MVC Architecture

A comprehensive CRM (Customer Relationship Management) backend system built with Node.js, Express, and MySQL featuring JWT authentication, CRUD operations, pagination, search, validation, error handling, and logging.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Role-based access control (admin, manager, user)

- **CRUD Operations**
  - Complete CRUD for Customers
  - Complete CRUD for Leads
  - User management

- **Advanced Features**
  - Pagination for list endpoints
  - Search functionality across entities
  - Status filtering for leads
  - Input validation using express-validator

- **Error Handling & Logging**
  - Centralized error handling
  - Winston logger with daily rotation
  - Request logging
  - Environment-based error responses

## 📁 Project Structure (MVC)

```
CRM/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection & initialization
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── customerController.js # Customer CRUD logic
│   │   └── leadController.js    # Lead CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── validate.js          # Validation middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Customer.js          # Customer model
│   │   └── Lead.js              # Lead model
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── customerRoutes.js    # Customer endpoints
│   │   └── leadRoutes.js        # Lead endpoints
│   ├── validators/
│   │   ├── authValidator.js     # Auth validation rules
│   │   ├── customerValidator.js # Customer validation rules
│   │   └── leadValidator.js     # Lead validation rules
│   └── utils/
│       └── logger.js            # Winston logger configuration
├── database/
│   └── setup.sql                # Database schema
├── logs/                        # Application logs (auto-generated)
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── server.js                    # Application entry point
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone & Install Dependencies

```bash
cd d:\CRM
npm install
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source database/setup.sql

# Or manually create the database
CREATE DATABASE crm_db;
```

### 3. Environment Configuration

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

### 4. Initialize Database Tables

The application will automatically create tables on first run, or you can manually run:

```javascript
const { initializeDatabase } = require('./src/config/database');
initializeDatabase();
```

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Customers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/customers` | Create customer | Yes |
| GET | `/api/customers` | Get all customers (with pagination & search) | Yes |
| GET | `/api/customers/:id` | Get customer by ID | Yes |
| PUT | `/api/customers/:id` | Update customer | Yes |
| DELETE | `/api/customers/:id` | Delete customer | Yes |

### Leads

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/leads` | Create lead | Yes |
| GET | `/api/leads` | Get all leads (with pagination, search & status filter) | Yes |
| GET | `/api/leads/:id` | Get lead by ID | Yes |
| PUT | `/api/leads/:id` | Update lead | Yes |
| DELETE | `/api/leads/:id` | Delete lead | Yes |

## 📝 API Usage Examples

### 1. Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 3. Create Customer

```bash
POST /api/customers
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "ABC Company",
  "email": "contact@abc.com",
  "phone": "+1234567890",
  "company": "ABC Corp",
  "address": "123 Main St",
  "status": "active"
}
```

### 4. Get Customers with Pagination & Search

```bash
GET /api/customers?page=1&limit=10&search=ABC
Authorization: Bearer <your_token>

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 5. Get Leads with Status Filter

```bash
GET /api/leads?page=1&limit=10&status=new&search=tech
Authorization: Bearer <your_token>
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned upon successful login and expires in 24 hours (configurable).

## ✅ Input Validation

All endpoints validate input data:
- Email format validation
- Required field checks
- Length constraints
- Enum value validation
- SQL injection prevention

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📊 Logging

Logs are stored in the `logs/` directory:
- `combined-{date}.log` - All logs
- `error-{date}.log` - Error logs only
- `exceptions-{date}.log` - Uncaught exceptions
- `rejections-{date}.log` - Unhandled promise rejections

Logs rotate daily and keep 14 days of history.

## 🔧 Configuration

Key configuration options in `.env`:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_*` - Database credentials
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time
- `CORS_ORIGIN` - Allowed CORS origin

## 🧪 Testing

Check server health:

```bash
GET /health

Response:
{
  "status": "OK",
  "message": "CRM Backend is running",
  "timestamp": "2026-01-19T..."
}
```

## 📦 Dependencies

**Production:**
- express - Web framework
- mysql2 - MySQL client
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- express-validator - Input validation
- winston - Logging
- dotenv - Environment variables
- cors - CORS middleware

**Development:**
- nodemon - Auto-reload during development

## 🚀 Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `JWT_SECRET` with a strong secret
3. Configure production database credentials
4. Set appropriate `CORS_ORIGIN`
5. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name crm-backend
pm2 save
pm2 startup
```

## 📄 License

ISC

## 👤 Author

Your Name

---

Built with ❤️ using Node.js, Express, and MySQL
