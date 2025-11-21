# MMORPG Server Documentation

## Overview

This is the backend server for the MMORPG 3D game. It provides RESTful API endpoints and WebSocket functionality for real-time multiplayer features.

## Tech Stack

- **Node.js** + **Express** - Backend framework
- **Socket.io** - Real-time WebSocket communication
- **MongoDB** + **Mongoose** - Database
- **TypeScript** - Type-safe development
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

## Environment Variables

```env
PORT=3000                                    # Server port
NODE_ENV=development                         # Environment
MONGODB_URI=mongodb://localhost:27017/mmorpg # MongoDB connection string
JWT_SECRET=your-secret-key                   # JWT secret for token signing
CLIENT_URL=http://localhost:5173             # Frontend URL for CORS
```

## Running the Server

### Development Mode
```bash
npm run server
```

This will start the server with nodemon for auto-reload on file changes.

### Production Mode
```bash
# Build TypeScript
npm run build:server

# Start server
npm run server:prod
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Username"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Characters

#### Get User Characters
```http
GET /api/characters
Authorization: Bearer <token>
```

#### Create Character
```http
POST /api/characters
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Hero",
  "class": "WARRIOR",
  ...
}
```

### Guilds

#### Get All Guilds
```http
GET /api/guilds
```

#### Create Guild
```http
POST /api/guilds
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Guild Name",
  "tag": "TAG",
  "description": "Guild description",
  "characterId": "character_id"
}
```

### Friends

#### Get Friends
```http
GET /api/friends
Authorization: Bearer <token>
```

#### Send Friend Request
```http
POST /api/friends/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetUserId": "user_id"
}
```

### Quests

#### Get All Quests
```http
GET /api/quests
```

#### Get Quests by Type
```http
GET /api/quests?type=daily
```

### Achievements

#### Get All Achievements
```http
GET /api/achievements
```

#### Get User Achievements
```http
GET /api/achievements/user
Authorization: Bearer <token>
```

### Battle Pass

#### Get Battle Pass Tiers
```http
GET /api/battle-pass/tiers
```

#### Get User Progress
```http
GET /api/battle-pass/progress?season=1
Authorization: Bearer <token>
```

#### Add XP
```http
POST /api/battle-pass/xp
Authorization: Bearer <token>
Content-Type: application/json

{
  "xp": 100,
  "season": 1
}
```

## WebSocket Events

### Client to Server

#### Authentication
```javascript
socket.emit('authenticate', { token, characterId });
```

#### Movement
```javascript
socket.emit('player:move', { position: { x, z, mapId } });
```

#### Combat
```javascript
socket.emit('combat:start', { combatId, participants });
socket.emit('combat:action', { combatId, action });
socket.emit('combat:end', { combatId });
```

#### Party
```javascript
socket.emit('party:create', { partyId, members });
socket.emit('party:invite', { partyId, characterId });
socket.emit('party:join', { partyId, characterId });
socket.emit('party:leave', { partyId, characterId });
```

#### Chat
```javascript
socket.emit('chat:message', { channel, message, characterName });
socket.emit('chat:whisper', { targetCharacterId, message, characterName });
```

### Server to Client

#### Authentication
```javascript
socket.on('authenticated', ({ success }) => {});
socket.on('auth:error', ({ message }) => {});
```

#### Player Events
```javascript
socket.on('player:joined', ({ characterId, socketId }) => {});
socket.on('player:left', ({ characterId }) => {});
socket.on('player:moved', ({ characterId, position }) => {});
```

#### Combat Events
```javascript
socket.on('combat:started', (data) => {});
socket.on('combat:action_performed', (data) => {});
socket.on('combat:ended', (data) => {});
```

#### Party Events
```javascript
socket.on('party:created', (data) => {});
socket.on('party:invitation', ({ partyId }) => {});
socket.on('party:member_joined', ({ partyId, characterId }) => {});
socket.on('party:member_left', ({ partyId, characterId }) => {});
```

#### Chat Events
```javascript
socket.on('chat:message_received', ({ channel, fromCharacterId, message, timestamp }) => {});
socket.on('chat:whisper_received', ({ fromCharacterId, message, timestamp }) => {});
socket.on('chat:error', ({ message }) => {});
```

## Database Models

### User
- email, password (hashed), displayName
- provider (email, google, github)
- createdAt, lastLogin

### Character
- userId, name, class, level, experience
- Stats: hp, mana, vigor, wisdom, strength, intelligence, agility, luck
- Combat: pa, pm, defense, resistances
- position, guildId, inventory, equipped artifacts

### Guild
- name, tag, description
- level, experience
- members (with ranks: leader, officer, member)
- maxMembers, treasury

### Quest
- title, description, type (daily, weekly, monthly, story, guild)
- objectives, rewards
- isRepeatable, resetTime

### Achievement
- id, title, description, category, icon, rarity
- criteria (type, target, required)
- rewards, isSecret

### BattlePass
- season, tier system (1-100)
- free and premium rewards per tier
- User progress tracking

### Friendship
- userId1, userId2
- status (pending, accepted, blocked)
- requestedBy

### Party
- name, members, maxMembers
- isPublic, currentDungeonId

## Development

### Project Structure
```
server/
├── index.ts              # Main server entry point
├── models/               # Mongoose models
│   ├── User.ts
│   ├── Character.ts
│   ├── Guild.ts
│   ├── Quest.ts
│   ├── Achievement.ts
│   ├── BattlePass.ts
│   ├── Friend.ts
│   └── Party.ts
├── routes/               # API routes
│   ├── auth.ts
│   ├── characters.ts
│   ├── guilds.ts
│   ├── friends.ts
│   ├── quests.ts
│   ├── achievements.ts
│   └── battlePass.ts
├── socket/               # WebSocket handlers
│   └── handlers.ts
├── middleware/           # Express middleware
│   └── auth.ts
└── utils/               # Utility functions
    └── auth.ts
```

### Adding New Features

1. **Create Model** (if needed)
   - Add new model in `server/models/`
   - Define TypeScript interface

2. **Create Routes**
   - Add routes in `server/routes/`
   - Implement CRUD operations
   - Add authentication middleware

3. **Add WebSocket Events** (if needed)
   - Update `server/socket/handlers.ts`
   - Define event listeners and emitters

4. **Test Endpoints**
   - Use Postman or curl to test APIs
   - Verify WebSocket events

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- API routes use authentication middleware
- CORS is configured for the client URL
- Input validation should be added for production

## Performance Tips

- Use MongoDB indexes on frequently queried fields
- Implement rate limiting for API endpoints
- Use Redis for session management in production
- Optimize WebSocket rooms for large-scale deployment
- Consider horizontal scaling with load balancers

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## License

MIT License - See LICENSE file for details
