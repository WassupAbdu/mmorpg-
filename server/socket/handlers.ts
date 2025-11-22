import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth';

interface ConnectedUser {
  userId: string;
  characterId: string;
  socketId: string;
  position: { x: number; z: number; mapId: string };
}

// NOTE: For production with multiple server instances, replace these in-memory Maps
// with Redis or a distributed cache to share state across servers
const connectedUsers = new Map<string, ConnectedUser>();
const activeParties = new Map<string, Set<string>>();
const activeCombats = new Map<string, any>();

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // Authentication
    socket.on('authenticate', async (data: { token: string; characterId: string }) => {
      try {
        const decoded = verifyToken(data.token);
        
        const user: ConnectedUser = {
          userId: decoded.userId,
          characterId: data.characterId,
          socketId: socket.id,
          position: { x: 0, z: 0, mapId: 'starter_map' },
        };
        
        connectedUsers.set(socket.id, user);
        
        socket.emit('authenticated', { success: true });
        
        // Notify others in the same map
        socket.broadcast.emit('player:joined', {
          characterId: data.characterId,
          socketId: socket.id,
        });
        
        console.log(`✅ Authenticated: ${decoded.userId} with character ${data.characterId}`);
      } catch (error) {
        socket.emit('auth:error', { message: 'Authentication failed' });
      }
    });

    // Movement
    socket.on('player:move', (data: { position: { x: number; z: number; mapId: string } }) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.position = data.position;
        
        // Broadcast to others in the same map
        socket.broadcast.emit('player:moved', {
          characterId: user.characterId,
          position: data.position,
        });
      }
    });

    // Combat
    socket.on('combat:start', (data: { combatId: string; participants: string[] }) => {
      activeCombats.set(data.combatId, {
        participants: data.participants,
        turn: 0,
        startedAt: Date.now(),
      });
      
      // Notify all participants
      data.participants.forEach(charId => {
        const userEntry = Array.from(connectedUsers.values()).find(u => u.characterId === charId);
        if (userEntry) {
          io.to(userEntry.socketId).emit('combat:started', data);
        }
      });
    });

    socket.on('combat:action', (data: any) => {
      const combat = activeCombats.get(data.combatId);
      if (combat) {
        // Broadcast action to all participants
        combat.participants.forEach((charId: string) => {
          const userEntry = Array.from(connectedUsers.values()).find(u => u.characterId === charId);
          if (userEntry) {
            io.to(userEntry.socketId).emit('combat:action_performed', data);
          }
        });
      }
    });

    socket.on('combat:end', (data: { combatId: string }) => {
      const combat = activeCombats.get(data.combatId);
      if (combat) {
        combat.participants.forEach((charId: string) => {
          const userEntry = Array.from(connectedUsers.values()).find(u => u.characterId === charId);
          if (userEntry) {
            io.to(userEntry.socketId).emit('combat:ended', data);
          }
        });
        activeCombats.delete(data.combatId);
      }
    });

    // Party
    socket.on('party:create', (data: { partyId: string; members: string[] }) => {
      activeParties.set(data.partyId, new Set(data.members));
      socket.join(`party:${data.partyId}`);
      
      // Notify all members
      data.members.forEach(charId => {
        const userEntry = Array.from(connectedUsers.values()).find(u => u.characterId === charId);
        if (userEntry) {
          io.to(userEntry.socketId).emit('party:created', data);
        }
      });
    });

    socket.on('party:invite', (data: { partyId: string; characterId: string }) => {
      const userEntry = Array.from(connectedUsers.values()).find(u => u.characterId === data.characterId);
      if (userEntry) {
        io.to(userEntry.socketId).emit('party:invitation', data);
      }
    });

    socket.on('party:join', (data: { partyId: string; characterId: string }) => {
      const party = activeParties.get(data.partyId);
      if (party) {
        party.add(data.characterId);
        socket.join(`party:${data.partyId}`);
        
        // Notify all party members
        io.to(`party:${data.partyId}`).emit('party:member_joined', data);
      }
    });

    socket.on('party:leave', (data: { partyId: string; characterId: string }) => {
      const party = activeParties.get(data.partyId);
      if (party) {
        party.delete(data.characterId);
        socket.leave(`party:${data.partyId}`);
        
        // Notify remaining members
        io.to(`party:${data.partyId}`).emit('party:member_left', data);
        
        // Delete party if empty
        if (party.size === 0) {
          activeParties.delete(data.partyId);
        }
      }
    });

    // Chat
    socket.on('chat:message', (data: { channel: string; message: string; characterName: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;
      
      const messageData = {
        ...data,
        characterId: user.characterId,
        timestamp: Date.now(),
      };
      
      switch (data.channel) {
        case 'global':
          io.emit('chat:message_received', messageData);
          break;
        case 'party':
          // Get user's party
          const userParty = Array.from(activeParties.entries()).find(([_, members]) => 
            members.has(user.characterId)
          );
          if (userParty) {
            io.to(`party:${userParty[0]}`).emit('chat:message_received', messageData);
          }
          break;
        case 'guild':
          // Broadcast to guild members (implement guild channel joining separately)
          socket.broadcast.emit('chat:message_received', messageData);
          break;
        default:
          socket.emit('chat:message_received', messageData);
      }
    });

    // Whisper
    socket.on('chat:whisper', (data: { targetCharacterId: string; message: string; characterName: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;
      
      const targetEntry = Array.from(connectedUsers.values()).find(u => u.characterId === data.targetCharacterId);
      if (targetEntry) {
        io.to(targetEntry.socketId).emit('chat:whisper_received', {
          fromCharacterId: user.characterId,
          fromCharacterName: data.characterName,
          message: data.message,
          timestamp: Date.now(),
        });
        
        // Send confirmation to sender
        socket.emit('chat:whisper_sent', {
          toCharacterId: data.targetCharacterId,
          message: data.message,
          timestamp: Date.now(),
        });
      } else {
        socket.emit('chat:error', { message: 'Player not online' });
      }
    });

    // Dungeon
    socket.on('dungeon:enter', (data: { dungeonId: string; partyId: string }) => {
      socket.join(`dungeon:${data.dungeonId}`);
      io.to(`party:${data.partyId}`).emit('dungeon:entered', data);
    });

    socket.on('dungeon:complete', (data: { dungeonId: string; partyId: string; rewards: any }) => {
      io.to(`dungeon:${data.dungeonId}`).emit('dungeon:completed', data);
      
      // Remove dungeon instance
      const socketsInDungeon = io.sockets.adapter.rooms.get(`dungeon:${data.dungeonId}`);
      if (socketsInDungeon) {
        socketsInDungeon.forEach(socketId => {
          io.sockets.sockets.get(socketId)?.leave(`dungeon:${data.dungeonId}`);
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log(`🔌 Disconnected: ${user.characterId}`);
        
        // Notify others
        socket.broadcast.emit('player:left', {
          characterId: user.characterId,
        });
        
        // Remove from active parties
        activeParties.forEach((members, partyId) => {
          if (members.has(user.characterId)) {
            members.delete(user.characterId);
            io.to(`party:${partyId}`).emit('party:member_left', {
              partyId,
              characterId: user.characterId,
            });
            
            if (members.size === 0) {
              activeParties.delete(partyId);
            }
          }
        });
        
        connectedUsers.delete(socket.id);
      }
    });
  });
}

export { connectedUsers, activeParties, activeCombats };
