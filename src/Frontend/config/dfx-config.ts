// DFX Configuration - Auto-generated from .dfx/local
export interface CanisterIds {
  __Candid_UI: {
    local: string;
    ic?: string;
  };
  ic_game_backend: {
    local: string;
    ic?: string;
  };
}

// Load canister IDs from copied file
export const loadCanisterIds = (): CanisterIds => {
  try {
    // Try to load from copied file first
    const canisterIds = require('../../hq4l/.dfx/local/canister_ids.json');
    return canisterIds;
  } catch (error) {
    // Fallback to default values
    console.warn('Could not load canister_ids.json, using defaults');
    return {
      __Candid_UI: {
        local: 'lz3um-vp777-77777-aaaba-cai'
      },
      ic_game_backend: {
        local: 'lqy7q-dh777-77777-aaaaq-cai'
      }
    };
  }
};

// Get current canister IDs
export const getCanisterIds = (): CanisterIds => {
  return loadCanisterIds();
};

// Get specific canister ID
export const getCanisterId = (name: keyof CanisterIds, network: 'local' | 'ic' = 'local'): string => {
  const ids = getCanisterIds();
  return ids[name]?.[network] || '';
};

// Network configuration
export const getNetworkConfig = (network: 'local' | 'ic' = 'local') => {
  if (network === 'local') {
    return {
      host: 'http://127.0.0.1:4943',
      canisterId: getCanisterId('ic_game_backend', 'local'),
      identityProvider: `http://127.0.0.1:4943/?canisterId=${getCanisterId('__Candid_UI', 'local')}`,
    };
  } else {
    return {
      host: 'https://ic0.app',
      canisterId: getCanisterId('ic_game_backend', 'ic'),
      identityProvider: 'https://identity.ic0.app',
    };
  }
};

// Auto-detect current network
export const getCurrentNetwork = (): 'local' | 'ic' => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  
  // Check if we have local canister IDs
  try {
    const ids = loadCanisterIds();
    if (ids.ic_game_backend?.local) {
      return 'local';
    }
  } catch (error) {
    // Ignore error
  }
  
  return 'ic';
};

// Get current network config
export const getCurrentNetworkConfig = () => {
  const network = getCurrentNetwork();
  return getNetworkConfig(network);
};
