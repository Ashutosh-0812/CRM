# CRM Backend - Modular Architecture

A Customer Relationship Management (CRM) backend application built with Node.js, Express, MySQL, and JWT authentication following a modular architecture pattern.

## 📁 Project Structure

```
CRM/
├── index.js                    # Main entry point
├── package.json
├── .env                        # Environment variables
├── database/                   # Database configurations
│   ├── dbProperties.js         # Database connection properties
│   ├── index.js                # Database initialization
│   ├── mongolib.js             # MongoDB library
│   ├── mysqllib.js             # MySQL library
│   ├── redislib.js             # Redis library (optional)
│   └── migration/
│       └── setup.sql           # Database schema
├── logging/
│   └── logging.js              # Winston logger configuration
├── middlewares/
│   ├── index.js                # Middleware exports
│   ├── authMiddleware.js       # JWT authentication
│   ├── errorHandler.js         # Error handling
│   ├── roleMiddleware.js       # Role-based access control
│   └── validateMiddleware.js   # Input validation
├── modules/                    # Feature modules
│   ├── index.js
│   ├── login/                  # Login module
│   │   ├── index.js            # Route configuration
│   │   ├── controllers/
│   │   │   └── loginController.js
│   │   ├── dao/
│   │   │   └── loginDao.js
│   │   ├── services/
│   │   │   ├── loginService.js
│   │   │   └── loginTokenService.js
│   │   └── validators/
│   │       └── loginValidator.js
│   ├── register/               # Registration module
│   │   ├── index.js
│   │   ├── controllers/
│   │   │   └── registerController.js
│   │   ├── dao/
│   │   │   └── registerDao.js
│   │   ├── services/
│   │   │   └── registerServices.js
│   │   └── validators/
│   │       └── registerValidator.js
│   ├── customer/               # Customer management module
│   │   ├── index.js
│   │   ├── controllers/
│   │   │   └── customerController.js
│   │   ├── dao/
│   │   │   └── customerDao.js
│   │   ├── services/
│   │   │   └── customerService.js
│   │   └── validators/
│   │       └── customerValidator.js
│   └── lead/                   # Lead management module
│       ├── index.js
│       ├── controllers/
│       │   └── leadController.js
│       ├── dao/
│       │   └── leadDao.js
│       ├── services/
│       │   └── leadService.js
│       └── validators/
│           └── leadValidator.js
├── properties/
│   └── envProperties.js        # Environment configuration
├── responses/
│   ├── responseConstants.js    # Response message constants
│   └── responses.js            # Standard response handlers
├── services/                   # Shared services
│   ├── jwtService.js           # JWT token generation & verification
│   ├── mailContent.js          # Email templates
│   ├── mailService.js          # Email service
│   ├── pwdServices.js          # Password hashing & validation
│   └── serverService.js        # Server configuration
├── startup/
│   └── index.js                # Application initialization
└── validators/
    ├── authValidator.js        # Authentication validators
    └── joiValidators.js        # Common validators
```

## 🏗️ Architecture Pattern

This project follows a **modular architecture** where each feature has its own folder with a consistent internal structure:

### Module Structure
Each module (login, register, customer, lead) follows this pattern:

- **controllers/** - Handle HTTP requests/responses
- **dao/** - Data Access Objects for database operations
- **services/** - Business logic layer
- **validators/** - Input validation rules
- **index.js** - Module route configuration

### Shared Components
Common functionality is organized at the root level:

- **database/** - Database connection libraries
- **logging/** - Winston logging utilities
- **middlewares/** - Express middleware (auth, error handling, validation)
- **properties/** - Environment and configuration
- **responses/** - Standard response handlers
- **services/** - Shared services (JWT, mail, password, etc.)
- **validators/** - Shared validation logic

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CRM
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=*

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@crm.com

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
```

4. Initialize the database
The database tables will be created automatically on first run.

5. Start the server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/users` - Get all users (admin only)
- `PATCH /api/auth/users/:id/verify` - Verify user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Customers (`/api/customers`)
- `POST /api/customers` - Create customer (protected)
- `GET /api/customers` - Get all customers (protected)
- `GET /api/customers/:id` - Get customer by ID (protected)
- `PUT /api/customers/:id` - Update customer (protected)
- `DELETE /api/customers/:id` - Delete customer (protected)

### Leads (`/api/leads`)
- `POST /api/leads` - Create lead (protected)
- `GET /api/leads` - Get all leads (protected)
- `GET /api/leads/:id` - Get lead by ID (protected)
- `PUT /api/leads/:id` - Update lead (protected)
- `DELETE /api/leads/:id` - Delete lead (protected)

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (15 minutes) for API requests
2. **Refresh Token**: Long-lived token (7 days) for getting new access tokens

Tokens can be sent in two ways:
- **Cookie**: Automatically set by the server
- **Authorization Header**: `Bearer <token>`

## 🛡️ Middleware

- **authMiddleware**: Validates JWT tokens
- **roleMiddleware**: Role-based access control (admin/user)
- **checkVerified**: Ensures user email is verified
- **errorHandler**: Centralized error handling
- **validate**: Input validation using express-validator

## 📝 Logging

Winston is used for logging with daily rotating files:
- `logs/error-{DATE}.log` - Error logs
- `logs/combined-{DATE}.log` - All logs
- Console output in development mode

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 👥 Author

Your Name

---

**Note**: This project has been restructured from the original MVC pattern to follow a modular architecture for better scalability and maintainability.
