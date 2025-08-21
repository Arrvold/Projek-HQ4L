import { Actor, HttpAgent } from '@dfinity/agent';
import { getCurrentNetworkConfig } from '../config/dfx-config';
import { identityManager } from './identityManager';

// Service interface based on Candid definition from backend
export interface IcGameBackend {
  registerUser: (username: string) => Promise<{ ok: UserProfile } | { err: RegistrationError }>;
  getProfileUser: () => Promise<{ Some: UserProfile } | { None: null }>;
  isUserExists: () => Promise<boolean>;
  chooseRole: (role_id_to_choose: number) => Promise<{ ok: null } | { err: UserError }>;
  getShop: () => Promise<Skin[]>;
  buySkin: (skin_id: number) => Promise<{ ok: number } | { err: ShopError }>;
  getInventory: () => Promise<InventoryItem[]>;
  activateSkin: (inventory_id: number) => Promise<{ ok: null } | { err: ShopError }>;
  whoami: () => Promise<string>;
}

// Types based on Candid interface
export interface UserProfile {
  coin: number;
  quests: Quest[];
  roles: RoleProfile[];
  skins: InventoryItem[];
  stamina: number;
  username: string;
}

export interface RoleProfile {
  badge: string;
  exp: number;
  id: number;
  is_active: boolean;
  level: number;
  name: string;
}

export interface Skin {
  description: string;
  id: number;
  image_url: string;
  is_limited: boolean;
  name: string;
  price: number;
  rarity: string;
}

export interface InventoryItem {
  acquired_at: number;
  id: number;
  is_active: boolean;
  skin_id: number;
}

export interface Quest {
  coin_reward: number;
  exp_reward: number;
  id: number;
  is_active: boolean;
  stamina_cost: number;
  title: string;
}

export interface RegistrationError {
  AlreadyRegistered?: null;
  UsernameTaken?: null;
}

export interface UserError {
  RoleNotFound?: null;
  UserNotFound?: null;
}

export interface ShopError {
  AlreadyOwned?: null;
  NotAdmin?: null;
  NotEnoughCoin?: null;
  SkinNotFound?: null;
  UserNotFound?: null;
}

// Create actor instance with dynamic configuration
export const createActor = async (): Promise<IcGameBackend> => {
  const config = getCurrentNetworkConfig();
  const identity = await identityManager.getCurrentIdentity();
  
  if (!identity) {
    throw new Error('No identity available. Please login first.');
  }
  
  // Create HTTP agent with identity
  const agent = new HttpAgent({
    host: config.host,
    identity,
  });
  
  // For now, return a mock actor until we implement proper IDL
  // TODO: Implement proper IDL factory from service.did
  return {
    registerUser: async (username: string) => {
      // Mock implementation - will be replaced with real canister call
      console.log(`Mock: Registering user ${username}`);
      const mockProfile: UserProfile = {
        username,
        coin: 0,
        stamina: 100,
        roles: [],
        skins: [],
        quests: []
      };
      return Promise.resolve({ ok: mockProfile });
    },
    getProfileUser: async () => {
      // Mock implementation - will be replaced with real canister call
      console.log('Mock: Getting user profile');
      const mockProfile: UserProfile = {
        username: 'TestUser',
        coin: 100,
        stamina: 80,
        roles: [],
        skins: [],
        quests: []
      };
      return Promise.resolve({ Some: mockProfile });
    },
    isUserExists: async () => {
      // Mock implementation - will be replaced with real canister call
      console.log('Mock: Checking if user exists');
      return Promise.resolve(false); // Change this to test different flows
    },
    chooseRole: async (roleId: number) => {
      // Mock implementation - will be replaced with real canister call
      console.log(`Mock: Choosing role ${roleId}`);
      return Promise.resolve({ ok: null });
    },
    getShop: async () => {
      // Mock implementation - will be replaced with real canister call
      console.log('Mock: Getting shop items');
      const mockSkins: Skin[] = [
        {
          id: 1,
          name: 'Golden Armor',
          description: 'Legendary armor with golden shine',
          rarity: 'Legendary',
          image_url: '/assets/bar100.png',
          is_limited: true,
          price: 1000
        },
        {
          id: 2,
          name: 'Silver Sword',
          description: 'Sharp and durable silver sword',
          rarity: 'Rare',
          image_url: '/assets/bar75.png',
          is_limited: false,
          price: 500
        }
      ];
      return Promise.resolve(mockSkins);
    },
    buySkin: async (skinId: number) => {
      // Mock implementation - will be replaced with real canister call
      console.log(`Mock: Buying skin ${skinId}`);
      return Promise.resolve({ ok: skinId });
    },
    getInventory: async () => {
      // Mock implementation - will be replaced with real canister call
      console.log('Mock: Getting inventory');
      const mockInventory: InventoryItem[] = [
        {
          id: 1,
          skin_id: 1,
          is_active: true,
          acquired_at: Date.now()
        }
      ];
      return Promise.resolve(mockInventory);
    },
    activateSkin: async (inventoryId: number) => {
      // Mock implementation - will be replaced with real canister call
      console.log(`Mock: Activating skin ${inventoryId}`);
      return Promise.resolve({ ok: null });
    },
    whoami: async () => {
      // Mock implementation - will be replaced with real canister call
      const principal = await identityManager.getPrincipalString();
      console.log(`Mock: Whoami - ${principal}`);
      return Promise.resolve(principal || 'Unknown');
    },
  } as IcGameBackend;
};

// Service class
export class IcGameService {
  private actor: IcGameBackend | null = null;

  private async getActor(): Promise<IcGameBackend> {
    if (!this.actor) {
      this.actor = await createActor();
    }
    return this.actor;
  }

  // User registration
  async registerUser(username: string): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.registerUser(username);
      
      if ('ok' in result) {
        return { success: true, data: result.ok };
      } else {
        const error = Object.keys(result.err)[0];
        return { success: false, error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // Get user profile
  async getUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    try {
      const actor = await this.getActor();
      const profile = await actor.getProfileUser();
      
      if ('Some' in profile) {
        return { success: true, data: profile.Some };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Failed to get profile' };
    }
  }

  // Check if user exists
  async checkUserExists(): Promise<boolean> {
    try {
      const actor = await this.getActor();
      return await actor.isUserExists();
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  }

  // Choose role
  async chooseRole(roleId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.chooseRole(roleId);
      
      if ('ok' in result) {
        return { success: true };
      } else {
        const error = Object.keys(result.err)[0];
        return { success: false, error };
      }
    } catch (error) {
      console.error('Choose role error:', error);
      return { success: false, error: 'Failed to choose role' };
    }
  }

  // Get shop items
  async getShop(): Promise<{ success: boolean; data?: Skin[]; error?: string }> {
    try {
      const actor = await this.getActor();
      const skins = await actor.getShop();
      return { success: true, data: skins };
    } catch (error) {
      console.error('Get shop error:', error);
      return { success: false, error: 'Failed to get shop' };
    }
  }

  // Buy skin
  async buySkin(skinId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.buySkin(skinId);
      
      if ('ok' in result) {
        return { success: true };
      } else {
        const error = Object.keys(result.err)[0];
        return { success: false, error };
      }
    } catch (error) {
      console.error('Buy skin error:', error);
      return { success: false, error: 'Failed to buy skin' };
    }
  }

  // Get inventory
  async getInventory(): Promise<{ success: boolean; data?: InventoryItem[]; error?: string }> {
    try {
      const actor = await this.getActor();
      const inventory = await actor.getInventory();
      return { success: true, data: inventory };
    } catch (error) {
      console.error('Get inventory error:', error);
      return { success: false, error: 'Failed to get inventory' };
    }
  }

  // Activate skin
  async activateSkin(inventoryId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.activateSkin(inventoryId);
      
      if ('ok' in result) {
        return { success: true };
      } else {
        const error = Object.keys(result.err)[0];
        return { success: false, error };
      }
    } catch (error) {
      console.error('Activate skin error:', error);
      return { success: false, error: 'Failed to activate skin' };
    }
  }

  // Get current user principal
  async getCurrentUser(): Promise<string | null> {
    try {
      const actor = await this.getActor();
      return await actor.whoami();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const icGameService = new IcGameService();
