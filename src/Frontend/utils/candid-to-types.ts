// Utility to convert Candid types to TypeScript
// This will be used to generate types from service.did

export interface CandidType {
  [key: string]: any;
}

// Convert Candid types to TypeScript interfaces
export const candidToTypescript = (candidContent: string): string => {
  let typescript = '// Auto-generated from Candid interface\n\n';
  
  // Extract type definitions
  const typeMatches = candidContent.match(/type\s+(\w+)\s*=\s*([^;]+);/g);
  
  if (typeMatches) {
    typeMatches.forEach(match => {
      const typeMatch = match.match(/type\s+(\w+)\s*=\s*([^;]+);/);
      if (typeMatch) {
        const [, typeName, typeDef] = typeMatch;
        typescript += `export interface ${typeName} {\n`;
        
        // Parse the type definition
        if (typeDef.includes('record')) {
          // Handle record types
          const recordMatch = typeDef.match(/record\s*{([^}]+)}/);
          if (recordMatch) {
            const fields = recordMatch[1].split(';').filter(f => f.trim());
            fields.forEach(field => {
              const fieldMatch = field.trim().match(/(\w+)\s*:\s*([^;]+)/);
              if (fieldMatch) {
                const [, fieldName, fieldType] = fieldMatch;
                const tsType = convertCandidTypeToTs(fieldType.trim());
                typescript += `  ${fieldName}: ${tsType};\n`;
              }
            });
          }
        } else if (typeDef.includes('variant')) {
          // Handle variant types
          const variantMatch = typeDef.match(/variant\s*{([^}]+)}/);
          if (variantMatch) {
            const variants = variantMatch[1].split(';').filter(v => v.trim());
            variants.forEach(variant => {
              const variantName = variant.trim();
              if (variantName) {
                typescript += `  ${variantName}?: {};\n`;
              }
            });
          }
        } else if (typeDef.includes('vec')) {
          // Handle vector types
          const vecMatch = typeDef.match(/vec\s+([^;]+)/);
          if (vecMatch) {
            const elementType = convertCandidTypeToTs(vecMatch[1].trim());
            typescript += `  [key: number]: ${elementType};\n`;
          }
        } else if (typeDef.includes('opt')) {
          // Handle optional types
          const optMatch = typeDef.match(/opt\s+([^;]+)/);
          if (optMatch) {
            const elementType = convertCandidTypeToTs(optMatch[1].trim());
            typescript += `  value?: ${elementType};\n`;
          }
        } else if (typeDef.includes('Result')) {
          // Handle Result types
          typescript += `  Ok?: any;\n`;
          typescript += `  Err?: any;\n`;
        } else {
          // Handle primitive types
          const tsType = convertCandidTypeToTs(typeDef.trim());
          typescript += `  value: ${tsType};\n`;
        }
        
        typescript += '}\n\n';
      }
    });
  }
  
  return typescript;
};

// Convert Candid primitive types to TypeScript
const convertCandidTypeToTs = (candidType: string): string => {
  switch (candidType) {
    case 'text':
      return 'string';
    case 'nat':
      return 'number';
    case 'int':
      return 'bigint';
    case 'bool':
      return 'boolean';
    case 'principal':
      return 'string';
    case 'blob':
      return 'Uint8Array';
    default:
      return 'any';
  }
};

// Generate types from service.did file
export const generateTypesFromDid = async (): Promise<string> => {
  try {
    // Try to read the service.did file
    const response = await fetch('/config/service.did');
    const candidContent = await response.text();
    return candidToTypescript(candidContent);
  } catch (error) {
    console.warn('Could not load service.did, using fallback types');
    return generateFallbackTypes();
  }
};

// Fallback types if service.did is not available
const generateFallbackTypes = (): string => {
  return `// Fallback types - service.did not available
export interface UserProfile {
  username: string;
  coin: number;
  stamina: number;
  roles: RoleProfile[];
  skins: InventoryItem[];
  quests: Quest[];
}

export interface RoleProfile {
  id: number;
  name: string;
  badge: string;
  level: number;
  exp: number;
  is_active: boolean;
}

export interface Skin {
  id: number;
  name: string;
  description: string;
  rarity: string;
  image_url: string;
  is_limited: boolean;
  price: number;
}

export interface InventoryItem {
  id: number;
  skin_id: number;
  is_active: boolean;
  acquired_at: bigint;
}

export interface Quest {
  id: number;
  title: string;
  exp_reward: number;
  coin_reward: number;
  stamina_cost: number;
  is_active: boolean;
}

export interface RegistrationError {
  UsernameTaken?: {};
  AlreadyRegistered?: {};
}

export interface UserError {
  UserNotFound?: {};
  RoleNotFound?: {};
}

export interface ShopError {
  UserNotFound?: {};
  SkinNotFound?: {};
  AlreadyOwned?: {};
  NotEnoughCoin?: {};
  NotAdmin?: {};
}

export type Result<T, E> = { Ok: T } | { Err: E };
`;
};
