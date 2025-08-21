import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { getCurrentNetworkConfig } from '../config/dfx-config';

// Interface for stored identity data
interface StoredIdentity {
  principal: string;
  timestamp: number;
  deviceId: string;
}

class IdentityManager {
  private authClient: AuthClient | null = null;
  private readonly STORAGE_KEY = 'ic_identity_data';
  private readonly DEVICE_ID_KEY = 'ic_device_id';

  // Generate or get device-specific ID
  private getDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  // Store identity data in localStorage
  private storeIdentity(principal: string): void {
    const identityData: StoredIdentity = {
      principal,
      timestamp: Date.now(),
      deviceId: this.getDeviceId()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(identityData));
    console.log('Identity stored in localStorage:', principal);
  }

  // Get stored identity data
  private getStoredIdentity(): StoredIdentity | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const identityData: StoredIdentity = JSON.parse(stored);
      
      // Check if identity is from same device
      if (identityData.deviceId !== this.getDeviceId()) {
        console.log('Device changed, clearing old identity');
        this.clearStoredIdentity();
        return null;
      }
      
      // Check if identity is not too old (30 days)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - identityData.timestamp > maxAge) {
        console.log('Identity too old, clearing');
        this.clearStoredIdentity();
        return null;
      }
      
      return identityData;
    } catch (error) {
      console.error('Error parsing stored identity:', error);
      return null;
    }
  }

  // Clear stored identity
  private clearStoredIdentity(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Identity cleared from localStorage');
  }

  // Initialize AuthClient
  private async initAuthClient(): Promise<AuthClient> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
      console.log('AuthClient initialized');
    }
    return this.authClient;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const authClient = await this.initAuthClient();
      const isAuth = await authClient.isAuthenticated();
      
      if (isAuth) {
        // Store identity if authenticated
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        this.storeIdentity(principal);
      }
      
      return isAuth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get current identity
  async getCurrentIdentity(): Promise<Identity | null> {
    try {
      const authClient = await this.initAuthClient();
      
      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        
        // Store identity if not already stored
        const stored = this.getStoredIdentity();
        if (!stored || stored.principal !== principal) {
          this.storeIdentity(principal);
        }
        
        return identity;
      }
      
      // Check if we have stored identity and try to restore
      const stored = this.getStoredIdentity();
      if (stored) {
        console.log('Found stored identity, attempting to restore:', stored.principal);
        // Note: In a real implementation, you might want to validate the stored identity
        // For now, we'll just return null and require re-authentication
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current identity:', error);
      return null;
    }
  }

  // Login with Internet Identity
  async login(): Promise<void> {
    try {
      const authClient = await this.initAuthClient();
      const config = getCurrentNetworkConfig();
      
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: config.identityProvider,
          onSuccess: () => {
            console.log('Internet Identity login successful');
            // Store identity after successful login
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal().toText();
            this.storeIdentity(principal);
            resolve();
          },
          onError: (error) => {
            console.error('Internet Identity login failed:', error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const authClient = await this.initAuthClient();
      await authClient.logout();
      this.clearStoredIdentity();
      console.log('Internet Identity logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // Get principal as string
  async getPrincipalString(): Promise<string | null> {
    try {
      const identity = await this.getCurrentIdentity();
      if (identity) {
        return identity.getPrincipal().toText();
      }
      return null;
    } catch (error) {
      console.error('Error getting principal string:', error);
      return null;
    }
  }

  // Check if stored identity is still valid
  isStoredIdentityValid(): boolean {
    const stored = this.getStoredIdentity();
    return stored !== null;
  }

  // Get stored principal (without authentication check)
  getStoredPrincipal(): string | null {
    const stored = this.getStoredIdentity();
    return stored ? stored.principal : null;
  }

  // Force clear all stored data
  clearAllData(): void {
    this.clearStoredIdentity();
    localStorage.removeItem(this.DEVICE_ID_KEY);
    console.log('All identity data cleared');
  }
}

// Export singleton instance
export const identityManager = new IdentityManager();
