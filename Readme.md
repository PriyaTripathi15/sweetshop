# 🍬 Sweet Shop Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing a sweet shop inventory with user authentication, role-based access control, and comprehensive testing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [My AI Usage](#my-ai-usage)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

## ✨ Features

### User Features
- 🔐 User registration and authentication with JWT
- 🔍 Search and filter sweets by name, category, and price range
- 🛒 Purchase sweets (decreases inventory)
- 📊 View real-time inventory status

### Admin Features
- ➕ Add new sweets to inventory
- ✏️ Update sweet details
- 🗑️ Delete sweets from inventory
- 📦 Restock sweets (increase quantity)

### Technical Features
- 🧪 Test-Driven Development (TDD) approach
- 🔒 Protected routes with role-based access control
- ✅ Input validation on both frontend and backend
- 📱 Responsive design for mobile and desktop
- 🎨 Modern, beautiful UI with gradient designs

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest & Supertest
- **Validation**: express-validator

### Frontend
- **Library**: React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind css with modern gradients and animations

## 📁 Project Structure

```
sweetshopproject/
├── backend/                         # Node.js/Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   └── sweetController.ts   # Sweet CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.ts              # JWT & admin middleware
│   │   ├── models/
│   │   │   ├── User.ts              # User schema
│   │   │   └── Sweet.ts             # Sweet schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Auth endpoints
│   │   │   └── sweetRoutes.ts       # Sweet endpoints
│   │   ├── services/
│   │   │   ├── authService.ts       # Auth business logic
│   │   │   ├── authService.test.ts  # Auth tests
│   │   │   ├── sweetService.ts      # Sweet business logic
│   │   │   └── sweetService.test.ts # Sweet tests
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
└── frontend/                        # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Login.js             # Login form
    │   │   ├── Register.js          # Registration form
    │   │   ├── Dashboard.js         # Main dashboard
    │   │   ├── SweetCard.js         # Sweet display card
    │   │   ├── AddSweetModal.js     # Add sweet modal
    │   │   ├── ProtectedRoute.js    # Route protection
    │   │   └── *.css                # Component styles
    │   ├── context/
    │   │   └── AuthContext.js       # Auth state management
    │   ├── services/
    │   │   └── api.js               # API client
    │   ├── App.js                   # Main app component
    │   └── index.js                 # App entry point
    ├── public/
    ├── package.json
    └── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables are already configured in `.env`:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://priyatripathi0415_db_user:H545dCwT8rD1ADEu@cluster0.psy0eos.mongodb.net/?appName=Cluster0
   JWT_SECRET=sweetshop_secret_key_change_in_production_2025
   NODE_ENV=development
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

### Creating an Admin User

To test admin features:

1. Register a normal user through the UI at `http://localhost:3000/register`
2. Manually update the user's role in MongoDB Atlas:
   - Go to MongoDB Atlas Dashboard
   - Browse Collections → sweetshop → users
   - Find your user and edit the `role` field from `"user"` to `"admin"`
3. Log out and log back in to see admin features

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Sweet Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/sweets` | Get all sweets | Authenticated |
| GET | `/api/sweets/search` | Search sweets | Authenticated |
| POST | `/api/sweets` | Create new sweet | Admin only |
| PUT | `/api/sweets/:id` | Update sweet | Admin only |
| DELETE | `/api/sweets/:id` | Delete sweet | Admin only |
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Authenticated |
| POST | `/api/sweets/:id/restock` | Restock sweet | Admin only |

## 🧪 Testing

The project follows Test-Driven Development (TDD) principles. Tests are written using Jest and Supertest.

### Running Tests

```bash
cd backend
npm test
```

### Test Coverage

### Test Coverage Report

Latest test run results:

```
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        15.396 s

Coverage Summary:
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |   26.31 |    40.54 |    37.5 |    28.3 |                   
 src/models          |     100 |      100 |     100 |     100 |                  
   Sweet.ts           |     100 |      100 |     100 |     100 |                  
   User.ts            |     100 |      100 |     100 |     100 |                  
 src/services        |   91.52 |    88.23 |   81.81 |   91.52 |                  
   authService.ts     |     100 |      100 |     100 |     100 |                  
   sweetService.ts    |   87.17 |    81.81 |      75 |   87.17 |                  
---------------------|---------|----------|---------|---------|-------------------
```

**Key Metrics:**
- ✅ **All tests passing** (15/15)
- ✅ **100% service layer coverage** for authService
- ✅ **87% coverage** for sweetService
- ✅ **100% model coverage**

### Test Structure

- **Unit Tests**: Service layer testing with mocked dependencies
- **Integration Tests**: API endpoint testing (can be added)
- **Test Files**: 
  - `authService.test.ts` - Authentication service tests
  - `sweetService.test.ts` - Sweet service tests

### Example Test Cases

✅ User registration with valid data  
✅ User login with correct credentials  
✅ Duplicate user registration prevention  
✅ Invalid credentials handling  
✅ Sweet creation and retrieval  
✅ Search functionality  
✅ Purchase with stock validation  
✅ Restock functionality  


### AI Tools Used



### How I Used AI

#### 1. **Project Structure & Setup**
- Used Copilot to generate initial project structure and boilerplate code.
#### 2. **Backend Development**
- **Models**: Copilot suggested Mongoose schema structures with proper validation rules
- **Controllers**: Created controller boilerplate with proper error handling

#### 3. **Test-Driven Development**
- take  help to  generate comprehensive test suites for services
- help for edge cases and error scenarios to test
- Generated mock implementations for database operations

#### 4. **Frontend Development**
- help for  React component structures with hooks
- Created context providers for authentication
- Suggested responsive CSS designs with modern gradients


#### 5. **API Integration**
- Created API service layer for clean separation of concerns
- Implemented error handling for network requests

#### 6. **Styling**
 use for styling in the project

### My Workflow with AI

1. **Red Phase (TDD)**: Wrote test descriptions, test implementations
2. **Green Phase**: Implemented features  suggestions, manually refined logic
3. **Refactor Phase**: Used to improve code structure and remove duplication

### Reflection on AI Impact

**Positive Impacts:**
 **Speed**: Reduced development time by approximately 40-50% **Learning**: Discovered new patterns and best practices through suggestions
**Focus**: Allowed me to focus on business logic rather than boilerplate


**Challenges & Manual Work:**
- 🔍 **Review Required**: Always reviewed AI-generated code for correctness
- 🎨 **Custom Logic**: Business-specific logic required manual implementation
- 🔧 **Integration**: Some integration points needed manual adjustment



### Transparency Commitment

Throughout development, I:
-  Reviewed all AI-generated code before committing
-  Modified suggestions to fit project requirements
-  Tested all functionality thoroughly
-  Understood every line of code in the project


## 📸 Screenshots

### Dashboard
![Sweet Shop Dashboard](output/dashboard)
*Main dashboard showing all available sweets with search and filters*

### Login Page
![Login Page](outputs/login.png)
*User-friendly login interface with gradient design*

### Registration Page
![Registration Page](outputs/register.png)
*Registration form with validation*

### Sweet Card
![Sweet Card Display](outputs/filter&serch.png)
*Individual sweet card with purchase option*

### Admin Panel
![Admin Panel](outputs/admin.png)
*Admin view with add, edit, delete, and restock options*

**Admin Login Credentials:**
- Email: admin@gmail.com
- Password: 12345




## 🎯 Quick Start Guide

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   npm start
   ```

3. **Create account** at http://localhost:3000/register

4. **Make yourself admin** via MongoDB Atlas to test admin features

5. **Start managing sweets!** 🍬

---

**Database**: MongoDB Atlas is already connected and ready to use!
