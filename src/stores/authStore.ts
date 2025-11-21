import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'github' | 'email';
}

interface AuthState {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // État initial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Connexion avec email/password
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implémenter l'authentification réelle
      // Pour l'instant, simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        provider: 'email',
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Échec de la connexion',
        isLoading: false,
      });
    }
  },
  
  // Connexion avec Google
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implémenter l'authentification Google réelle
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user: User = {
        id: `google_${Date.now()}`,
        email: 'user@google.com',
        displayName: 'Google User',
        provider: 'google',
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Échec de la connexion avec Google',
        isLoading: false,
      });
    }
  },
  
  // Connexion avec GitHub
  loginWithGitHub: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implémenter l'authentification GitHub réelle
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user: User = {
        id: `github_${Date.now()}`,
        email: 'user@github.com',
        displayName: 'GitHub User',
        provider: 'github',
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Échec de la connexion avec GitHub',
        isLoading: false,
      });
    }
  },
  
  // Inscription
  register: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implémenter l'inscription réelle
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        displayName,
        provider: 'email',
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Échec de l\'inscription',
        isLoading: false,
      });
    }
  },
  
  // Déconnexion
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  // Définir l'utilisateur
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: user !== null,
    });
  },
  
  // Définir l'erreur
  setError: (error: string | null) => {
    set({ error });
  },
  
  // Définir le chargement
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
