# Chat App API

A modern, real-time messaging API built with TypeScript, Express.js, and WebSocket technology. This API enables seamless communication between users through chat rooms with real-time message delivery and online user tracking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Chat App API is a robust backend solution for real-time chat applications. It provides comprehensive REST API endpoints for authentication, user management, and room administration, combined with Socket.io for instant message delivery and real-time user presence tracking.

---

## Features

- ✅ **User Authentication** - Secure JWT-based authentication with bcryptjs password hashing
- ✅ **Real-time Messaging** - Instant message delivery using WebSocket connections
- ✅ **Chat Rooms** - Create and manage multiple chat room channels
- ✅ **User Presence** - Real-time online user tracking and status updates
- ✅ **CORS Support** - Cross-origin resource sharing enabled for flexible client integration
- ✅ **Type Safety** - Full TypeScript support with strict type checking
- ✅ **Data Validation** - Input validation using Zod schema validation library
- ✅ **Database Integrity** - PostgreSQL with Prisma ORM for relational data management

---

## Tech Stack

### Backend Framework
- **Express.js** (v5.2.1) - Fast, unopinionated web framework for Node.js
- **Node.js** - JavaScript runtime environment

### Language
- **TypeScript** (v5.9.3) - Superset of JavaScript with static type checking

### Real-time Communication
- **Socket.io** (v4.8.3) - Event-based real-time communication library

### Database
- **PostgreSQL** - Robust relational database system
- **Prisma** (v5.22.0) - Next-generation ORM for type-safe database access

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.3) - JSON Web Token for stateless authentication
- **bcryptjs** (v3.0.3) - Password hashing library

### Validation
- **Zod** (v4.3.6) - TypeScript-first schema validation library

### Development Tools
- **TypeScript** - Static type checking
- **ts-node** (v10.9.2) - Execute TypeScript files directly
- **Nodemon** (v3.1.14) - Auto-restart development server on file changes
- **CORS** (v2.8.6) - Cross-Origin Resource Sharing middleware
- **dotenv** (v17.3.1) - Environment variable management

### Development Dependencies
- **@types/node** - TypeScript definitions for Node.js
- **@types/express** - TypeScript definitions for Express
- **@types/jsonwebtoken** - TypeScript definitions for JWT

---

## Project Structure

```
chat-app-api/
├── src/
│   ├── index.ts                 # Application entry point & Socket.io setup
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication logic (login, register)
│   │   └── rooms.controller.ts  # Room management logic
│   ├── routes/
│   │   ├── auth.routes.ts       # Authentication endpoints
│   │   └── rooms.routes.ts      # Room management endpoints
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   └── lib/
│       ├── jwt.ts               # JWT token utilities (sign, verify)
│       └── prisma.ts            # Prisma client export
├── prisma/
│   └── schema.prisma            # Database schema definition
├── dist/                        # Compiled JavaScript (generated)
├── node_modules/                # Project dependencies
├── package.json                 # Project metadata & dependencies
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables (not committed)
└── README.md                    # This file
```

### Directory Descriptions

- **src/controllers** - Business logic for handling requests. Each controller manages a specific domain (auth, rooms).
- **src/routes** - Express route definitions that map HTTP requests to controller methods.
- **src/middleware** - Reusable functions that process requests (authentication verification).
- **src/lib** - Utility functions and configurations (JWT operations, database client).
- **prisma** - Database configuration and schema definitions.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version
npm --version
psql --version
```

---

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

---

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/chat_app_db"

# JWT Configuration
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# CORS Configuration (optional)
CORS_ORIGIN="*"
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secure-secret-key` |
| `JWT_EXPIRATION` | JWT token expiration time | `7d`, `24h` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development`, `production` |
| `CORS_ORIGIN` | Allowed origins for CORS | `*`, `http://localhost:3000` |

**⚠️ Security Note:** Never commit the `.env` file. Add it to `.gitignore`.

---

## Database Configuration

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE chat_app_db;

# Exit psql
\q
```

### Run Migrations

```bash
# Run pending migrations
npx prisma migrate dev

# View database
npx prisma studio
```

### Prisma Studio (GUI)

Launch Prisma Studio to visualize and edit your database:

```bash
npx prisma studio
```

This opens a browser interface at `http://localhost:5555` where you can manage your data.

---

## Running the Application

### Development Mode

With auto-reload on file changes:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Production Build

Build the TypeScript to JavaScript:

```bash
npm run build
```

### Production Run

```bash
npm start
```

### Health Check

Verify the server is running:

```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

---

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201)**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200)**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

---

### Room Endpoints

#### Create Room
```http
POST /api/rooms
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "General Discussion",
  "description": "A room for general discussions"
}
```

**Response (201)**
```json
{
  "id": "room-id",
  "name": "General Discussion",
  "description": "A room for general discussions",
  "createdAt": "2026-02-22T10:30:00Z"
}
```

#### Get All Rooms
```http
GET /api/rooms
Authorization: Bearer <jwt-token>
```

**Response (200)**
```json
[
  {
    "id": "room-id",
    "name": "General Discussion",
    "description": "A room for general discussions",
    "createdAt": "2026-02-22T10:30:00Z",
    "_count": {
      "members": 5,
      "messages": 42
    }
  }
]
```

#### Get Room Details
```http
GET /api/rooms/:roomId
Authorization: Bearer <jwt-token>
```

**Response (200)**
```json
{
  "id": "room-id",
  "name": "General Discussion",
  "description": "Room description",
  "createdAt": "2026-02-22T10:30:00Z",
  "members": [...],
  "messages": [...]
}
```

#### Join Room
```http
POST /api/rooms/:roomId/join
Authorization: Bearer <jwt-token>
```

**Response (200)**
```json
{
  "message": "Successfully joined room",
  "roomId": "room-id"
}
```

#### Leave Room
```http
POST /api/rooms/:roomId/leave
Authorization: Bearer <jwt-token>
```

**Response (200)**
```json
{
  "message": "Successfully left room"
}
```

---

## WebSocket Events

### Connection
Connect to the WebSocket server with an authentication token:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client → Server Events

#### Join Room
```javascript
socket.emit('join_room', 'room-id');
```

#### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'room-id',
  content: 'Hello everyone!'
});
```

#### Leave Room
```javascript
socket.emit('leave_room', 'room-id');
```

#### Typing Indicator
```javascript
socket.emit('user_typing', { roomId: 'room-id' });
```

---

### Server → Client Events

#### Online Users
Emitted when user connects/disconnects:

```javascript
socket.on('online_users', (userIds) => {
  console.log('Online users:', userIds);
});
```

#### New Message
Received when a message is sent in a room you're in:

```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // {
  //   id: 'message-id',
  //   content: 'Hello',
  //   userId: 'user-id',
  //   roomId: 'room-id',
  //   createdAt: '2026-02-22T10:30:00Z'
  // }
});
```

#### User Joined Room
```javascript
socket.on('user_joined_room', { userId, roomId }) => {
  console.log('User joined:', userId);
});
```

#### User Left Room
```javascript
socket.on('user_left_room', { userId, roomId }) => {
  console.log('User left:', userId);
});
```

#### User Typing
```javascript
socket.on('user_typing', (userId) => {
  console.log('User is typing:', userId);
});
```

---

## Database Schema

### User Model
```typescript
model User {
  id        String    @id @default(cuid())          // Unique identifier
  name      String                                   // User's display name
  email     String    @unique                        // Unique email address
  password  String                                   // Hashed password
  avatar    String?                                  // Optional profile picture URL
  createdAt DateTime  @default(now())                // Account creation timestamp
  messages  Message[]                                // Messages authored by user
  members   Member[]                                 // Rooms user is member of
}
```

### Room Model
```typescript
model Room {
  id          String    @id @default(cuid())
  name        String    @unique                      // Unique room name
  description String?                                // Optional room description
  createdAt   DateTime  @default(now())
  messages    Message[]                              // Messages in room
  members     Member[]                               // Members in room
}
```

### Member Model (Junction Table)
```typescript
model Member {
  id       String    @id @default(cuid())
  userId   String
  roomId   String
  joinedAt DateTime  @default(now())
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  room     Room      @relation(fields: [roomId], references: [id], onDelete: Cascade)
  
  @@unique([userId, roomId])                         // User can only join room once
}
```

### Message Model
```typescript
model Message {
  id        String   @id @default(cuid())
  content   String                                   // Message text
  createdAt DateTime @default(now())                 // Message timestamp
  userId    String                                   // Author of message
  roomId    String                                   // Room message belongs to
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
}
```

### Relationships
- **User ↔ Message**: One-to-Many (User authors multiple messages)
- **User ↔ Room**: Many-to-Many (through Member junction table)
- **Room ↔ Message**: One-to-Many (Room contains multiple messages)

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│          Client Applications             │
│     (Web Browser, Mobile App, etc)       │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼──────────┐      ┌──────▼────────┐
    │  HTTP/REST   │      │  WebSocket    │
    │  API Routes  │      │  Socket.io    │
    └───┬──────────┘      └──────┬────────┘
        │                        │
        └────────────┬───────────┘
                     │
         ┌───────────▼────────────┐
         │  Route Handlers/       │
         │  Controllers           │
         │ (auth, rooms)          │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Middleware            │
         │ (Auth verification)    │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Business Logic        │
         │ (Controllers)          │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Data Access Layer     │
         │ (Prisma ORM)           │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  PostgreSQL Database   │
         │ (User, Room, Message)  │
         └────────────────────────┘
```

### Request Flow

1. **Client** sends HTTP request or WebSocket connection
2. **Express/Socket.io** receives and routes the request
3. **Middleware** (auth) validates JWT token
4. **Controller** processes business logic
5. **Prisma** executes database operations
6. **Response** returned to client

---

## Development

### Code Style

The project uses TypeScript with strict mode enabled. Follow these conventions:

- Use **PascalCase** for class and type names: `User`, `AuthController`
- Use **camelCase** for variables and functions: `getUserById`, `sendMessage`
- Use **UPPER_SNAKE_CASE** for constants: `JWT_SECRET`, `DATABASE_URL`
- Always add type annotations: `const name: string = "John"`

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Debugging

Set environment variable:
```bash
export DEBUG=chat-app-api:*
npm run dev
```

Or use VS Code debugger with launch configuration.

---

## Security Considerations

⚠️ **Important Security Notes:**

1. **Environment Variables** - Never commit `.env` file
2. **JWT Secret** - Change `JWT_SECRET` in production to a strong random value
3. **CORS** - Restrict `CORS_ORIGIN` to your frontend domain in production
4. **HTTPS** - Always use HTTPS in production
5. **Password Hashing** - Passwords are hashed with bcryptjs (11 salt rounds)
6. **Authentication** - All endpoints except `/health` require JWT token
7. **Database** - Use strong PostgreSQL credentials
8. **Rate Limiting** - Consider implementing rate limiting in production

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
```

### JWT Token Issues
- Ensure token is sent in `Authorization: Bearer <token>` header
- Check token hasn't expired
- Verify JWT_SECRET matches between encoding and decoding

### WebSocket Connection Failed
- Confirm CORS settings are correct
- Check Socket.io token is provided in `auth`
- Ensure server is running (`npm run dev`)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add my feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

---

## License

ISC © 2026

---

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Last Updated:** February 2026  
**Version:** 1.0.0
