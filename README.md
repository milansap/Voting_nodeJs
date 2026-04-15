# Voting Application

A full-stack web application for managing online voting events. Built with Node.js/Express backend and Next.js frontend.

## 🎯 Features

- **User Management**: User registration, login, and profile management
- **Candidate Management**: Admin can create, update, and manage candidates
- **Event Management**: Create and manage voting events
- **Voting System**: Users can vote for candidates in active events
- **Vote Counting**: Real-time vote tracking and results
- **Profile Pictures**: Upload and manage user profile pictures
- **Role-based Access**: Admin and user roles with appropriate permissions
- **Authentication**: JWT-based authentication system

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Environment**: dotenv

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: CSS with theme support
- **UI Components**: Custom components with shadcn/ui
- **HTTP Client**: Axios with interceptors
- **State Management**: Zustand (auth store)

## 📁 Project Structure

```
voting_application/
│
├── backend/
│   ├── models/
│   │   ├── user.js          # User schema
│   │   ├── candidates.js    # Candidate schema
│   │   └── events.js        # Event schema
│   ├── routes/
│   │   ├── userRoutes.js    # User endpoints
│   │   ├── candidateRoutes.js   # Candidate endpoints
│   │   └── eventsRoutes.js  # Event endpoints
│   ├── db.js                # Database connection
│   ├── jwt.js               # JWT authentication
│   ├── uploadMiddleware.js  # File upload configuration
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── uploads/             # Uploaded files directory
│
└── voting_frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/      # Authentication pages
    │   │   ├── (main)/      # Main application pages
    │   │   ├── _apis/       # API endpoints and interceptors
    │   │   └── layout.tsx   # Root layout
    │   ├── components/
    │   │   ├── auth/        # Auth components
    │   │   └── ui/          # UI components
    │   ├── lib/             # Utility functions and hooks
    │   └── globals.css      # Global styles
    ├── tsconfig.json
    ├── next.config.ts
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:3001
```

4. Start the server:
```bash
npm start
# or with nodemon for development
nodemon server.js
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd voting_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Users
- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)
- `PUT /api/profile/password` - Change password (protected)
- `PUT /api/profile/picture/:id` - Upload profile picture (protected)

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create candidate (admin only)
- `PUT /api/candidates/:candidateId` - Update candidate (admin only)
- `DELETE /api/candidates/:candidateId` - Delete candidate (admin only)
- `POST /api/candidates/vote/:candidateId` - Cast vote (protected)
- `GET /api/candidates/vote/count` - Get vote counts

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:eventId` - Update event (admin only)
- `DELETE /api/events/:eventId` - Delete event (admin only)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent with every protected request via Authorization header
5. Server validates token before allowing access

### Protected Routes
All routes except login and signup require authentication and appropriate user role.

## 📸 File Upload

- Maximum file size: 5MB
- Supported formats: Image files only (image/*)
- Upload directories:
  - Profile pictures: `/uploads/profile/`
  - Candidate images: `/uploads/candidates/`

## 🛠️ Environment Variables

### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/voting_app
JWT_SECRET=your_secret_key_here
BASE_URL=http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 📝 Error Handling

The application includes comprehensive error handling:
- Validation errors with specific messages
- File upload errors with size/type validation
- Authentication errors with proper status codes
- Database errors logged to console
- Generic error responses to clients

## 🔄 Vote System

1. User can only vote once per event
2. Admin cannot vote
3. Event must be in "active" status for voting
4. Vote count is automatically incremented
5. Vote history is tracked with timestamps

## 💾 Database Models

### User
```javascript
{
  citizenship_no: String (unique),
  password: String (hashed),
  name: String,
  email: String,
  mobile_number: String,
  address: String,
  image: String (URL),
  role: String (user/admin),
  isVoted: Boolean
}
```

### Candidate
```javascript
{
  name: String,
  party: String,
  position: String,
  image: String (URL),
  voteCount: Number,
  votes: [{user: ObjectId, votedAt: Date}]
}
```

### Event
```javascript
{
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: String (active/inactive)
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows: Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux: Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### CORS Issues
- Ensure backend is running on correct port
- Check CORS middleware configuration
- Verify frontend API base URL

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)

## 📄 License

This project is private and not licensed for external use.

## ✅ Development Checklist

- [x] User authentication (signup/login)
- [x] Profile management
- [x] Candidate management
- [x] Event management
- [x] Voting system
- [x] File uploads
- [x] Error handling
- [ ] Unit tests
- [ ] Integration tests
- [ ] Deployment configuration

## 🤝 Contributing

This is a private project. For internal development, ensure:
- Code follows the existing style
- All errors are properly handled
- API responses include proper status codes
- File uploads are cleaned on errors
- Environment variables are never committed

---

**Last Updated**: April 16, 2026
