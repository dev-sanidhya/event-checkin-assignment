# Real-Time Event Check-In App

A full-stack React Native application with Node.js backend that allows users to browse events and check in to them with real-time updates.

## 🚀 Features

- **Real-time Event Updates**: See attendees join/leave events instantly via WebSocket
- **GraphQL API**: Efficient data fetching with Apollo Client
- **Mock Authentication**: JWT-based authentication with demo users
- **Cross-platform**: React Native Expo app works on iOS and Android
- **Type Safety**: Full TypeScript implementation
- **Modern State Management**: Zustand for local state, TanStack Query for server state

## 🛠 Tech Stack

### Backend

- **Node.js** with TypeScript
- **GraphQL** with Apollo Server Express
- **PostgreSQL** database with Prisma ORM
- **Socket.io** for real-time communication
- **JWT** for authentication

### Frontend

- **React Native** with Expo
- **TypeScript** for type safety
- **Apollo Client** for GraphQL
- **Zustand** for state management
- **TanStack Query** for data fetching
- **Socket.io Client** for real-time updates

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Expo CLI (for mobile development)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd event-checkin-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

**Environment Variables (.env):**

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/event_checkin_db?schema=public"
JWT_SECRET="your_jwt_secret_key_here"
PORT=4000
```

### 3. Database Setup

```bash
# Create database (if not exists)
sudo -u postgres createdb event_checkin_db

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run seed
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
npm start
```

The backend will be available at:

- GraphQL Playground: http://localhost:4000/graphql
- Socket.io: http://localhost:4000

### Start the Frontend App

```bash
cd frontend

# Start Expo development server
npm start

# Or run on specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## 🔐 Demo Credentials

The app includes mock authentication with these demo users:

- **John Doe**: `john@example.com`
- **Jane Smith**: `jane@example.com`
- **Bob Johnson**: `bob@example.com`

_Note: Password is optional for demo purposes_

## 📱 How to Use

1. **Login**: Use one of the demo emails or enter any email to create a new user
2. **Browse Events**: View the list of upcoming events with attendee counts
3. **Join Events**: Tap on an event to view details and join/leave
4. **Real-time Updates**: See other users join/leave events instantly

## 🏗 Project Structure

```
event-checkin-app/
├── backend/
│   ├── src/
│   │   ├── types/          # GraphQL schema definitions
│   │   ├── resolvers/      # GraphQL resolvers
│   │   ├── utils/          # Utility functions (auth, context)
│   │   └── index.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── components/         # React Native components
│   ├── lib/               # Apollo Client, Socket.io setup
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript type definitions
│   ├── graphql/           # GraphQL queries and mutations
│   └── App.tsx            # Main app component
└── README.md
```

## 🔌 API Endpoints

### GraphQL Queries

- `events`: Get all events with attendees
- `event(id)`: Get specific event details
- `me`: Get current user info

### GraphQL Mutations

- `login(email, password)`: Authenticate user
- `joinEvent(eventId)`: Join an event
- `leaveEvent(eventId)`: Leave an event

### WebSocket Events

- `join-event`: Join event room for real-time updates
- `leave-event`: Leave event room
- `event-updated`: Receive real-time event updates

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Test GraphQL endpoints
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { events { id name location attendees { name } } }"}'

# Test authentication
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"john@example.com\", password: \"test\") { token user { name } } }"}'
```

### Frontend Testing

The React Native app can be tested using:

- Expo Go app on physical device
- iOS Simulator (macOS only)
- Android Emulator
- Web browser (limited functionality)

## 🚀 Deployment

### Backend Deployment

1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build for production: `expo build`
2. Deploy to app stores or use Expo's hosting

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error:**

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**Port Already in Use:**

```bash
# Kill process using port 4000
pkill -f "node.*4000"
```

**Expo Metro Bundle Error:**

```bash
# Clear Expo cache
expo start -c
```

## 📝 Assignment Requirements Checklist

- ✅ **Backend (Node.js + GraphQL + Prisma + Socket.io)**

  - ✅ GraphQL API with queries and mutations
  - ✅ Prisma with PostgreSQL integration
  - ✅ Mock authentication system (JWT)
  - ✅ Socket.io for real-time updates

- ✅ **Frontend (React Native + Expo)**

  - ✅ Basic login screen
  - ✅ Event List Page with TanStack Query
  - ✅ Event Detail Page with join functionality
  - ✅ Zustand for state management
  - ✅ Real-time updates via Socket.io

- ✅ **Database Schema (Prisma)**

  - ✅ User model with events relation
  - ✅ Event model with attendees relation

- ✅ **Additional Features**
  - ✅ TypeScript throughout
  - ✅ Clean folder structure
  - ✅ Working real-time updates
  - ✅ Proper use of Zustand and TanStack Query

## 👥 Contributors

- Sanidhya Shishodia - Full Stack Developer

## 📄 License

This project is for educational purposes as part of a full-stack developer assignment.
