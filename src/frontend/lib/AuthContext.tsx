"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory as backendIDL } from "../../declarations/backend";
import { BACKEND_CANISTER_ID, II_URL, NETWORK_HOST } from "./config";

interface AuthContextType {
  actor: any | null;
  isAuthenticated: boolean;
  login: () => Promise<any>; 
  logout: () => Promise<void>;
  identity: Identity | null;
  userProfile: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [actor, setActor] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createActor = (identity: Identity) => {
    const agent = new HttpAgent({
      identity,
      host: NETWORK_HOST,
    });

    // wajib untuk local development
    agent
      .fetchRootKey()
      .catch((err) => console.error("Unable to fetch root key:", err));

    return Actor.createActor(backendIDL, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  };

  const login = async (): Promise<any> => {
    const authClient = await AuthClient.create();
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: II_URL,
        onSuccess: async () => {
          try {
            const identity = authClient.getIdentity();
            const newActor = createActor(identity);
            setIdentity(identity);
            setActor(newActor);
            setIsAuthenticated(true);

            setIsLoading(false);

            resolve(newActor); 
          } catch (error) {
            setIsLoading(false);
            reject(error);
          }
        },
        onError: (err) => {
          setIsLoading(false);
          reject(err);
        },
      });
    });
  };


  const logout = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setActor(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      setIdentity(null);
    }
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
    <AuthContext.Provider
      value={{
        actor,
        isAuthenticated,
        login,
        logout,
        identity,
        userProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
