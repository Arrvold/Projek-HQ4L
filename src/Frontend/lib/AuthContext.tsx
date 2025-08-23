"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory as backendIDL } from "../../declarations/backend"; // Sesuaikan path
import { BACKEND_CANISTER_ID, II_URL, IS_LOCAL } from "../lib/config"; // Sesuaikan path

// 1. Interface diperbarui
interface AuthContextType {
  actor: any | null;
  isAuthenticated: boolean;
  login: () => Promise<{ profile: any | null }>;
  logout: () => Promise<void>;
  identity: Identity | null;
  userProfile: any | null;
  isLoading: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 2. State baru ditambahkan
  const [actor, setActor] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createActor = (identity: Identity) => {
    const agent = new HttpAgent({ identity, host: IS_LOCAL ? "http://127.0.0.1:4943" : "https://icp-api.io" });
    if (IS_LOCAL) {
      agent.fetchRootKey().catch(err => console.error("Unable to fetch root key:", err));
    }
    return Actor.createActor(backendIDL, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  };

  // 3. Logika untuk fetch profil
  const fetchProfile = async (backendActor: any) => {
    try {
      const profile = await backendActor.getProfileUser();
      if (profile) {
        setUserProfile(profile);
        return profile;
      }
    } catch (err) {
      console.error("Gagal mengambil profil pengguna:", err);
    }
    setUserProfile(null);
    return null;
  };
  
  const refetchProfile = async () => {
    if (actor) {
        setIsLoading(true);
        await fetchProfile(actor);
        setIsLoading(false);
    }
  };

  const login = async (): Promise<{ profile: any | null }> => {
    const authClient = await AuthClient.create();
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: II_URL,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const newActor = createActor(identity);
          setIdentity(identity);
          setActor(newActor);
          setIsAuthenticated(true);
          const profile = await fetchProfile(newActor);
          setIsLoading(false);
          resolve({ profile });
        },
        onError: (err) => {
          setIsLoading(false);
          reject(err);
        },
      });
    });
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setActor(null);
    setIsAuthenticated(false);
    setUserProfile(null);
    setIdentity(null);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      try {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          const identity = authClient.getIdentity();
          const newActor = createActor(identity);
          setIdentity(identity);
          setActor(newActor);
          setIsAuthenticated(true);
          await fetchProfile(newActor);
        }
      } catch (error) {
        console.error("Gagal memeriksa status login: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    // 4. Value diperbarui
    <AuthContext.Provider value={{ actor, isAuthenticated, login, logout, identity, userProfile, isLoading, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};