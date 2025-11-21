import { io, Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

class SocketManager {
  private socket: Socket | null = null;
  private authenticated = false;

  connect(token: string, characterId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to server');
        
        // Authenticate
        this.socket!.emit('authenticate', { token, characterId });
      });

      this.socket.on('authenticated', (data: { success: boolean }) => {
        if (data.success) {
          this.authenticated = true;
          console.log('✅ Authenticated');
          resolve();
        } else {
          reject(new Error('Authentication failed'));
        }
      });

      this.socket.on('auth:error', (data: { message: string }) => {
        console.error('Authentication error:', data.message);
        reject(new Error(data.message));
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Disconnected from server');
        this.authenticated = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.authenticated = false;
    }
  }

  emit(event: string, data: any) {
    if (this.socket && this.authenticated) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected or not authenticated');
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected && this.authenticated || false;
  }
}

export const socketManager = new SocketManager();
