import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type CurrentRoleId = bigint;
export interface DebugUser {
  'username' : string,
  'stamina' : bigint,
  'coin' : bigint,
  'last_action_timestamp' : Time,
  'owner_principal' : Principal,
}
export type InventoryId = bigint;
export interface InventoryItem {
  'id' : InventoryId,
  'skin_id' : SkinId,
  'acquired_at' : Time,
  'is_active' : boolean,
}
export interface Quest {
  'id' : QuestId,
  'title' : string,
  'exp_reward' : bigint,
  'stamina_cost' : bigint,
  'is_active' : boolean,
  'coin_reward' : bigint,
}
export type QuestId = bigint;
export type RegistrationError = { 'UsernameTaken' : null } |
  { 'AlreadyRegistered' : null };
export type Result = { 'ok' : UserProfile } |
  { 'err' : RegistrationError };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : UserError };
export type Result_3 = { 'ok' : null } |
  { 'err' : ShopError };
export type Result_4 = { 'ok' : SkinId } |
  { 'err' : ShopError };
export interface RoleProfile {
  'id' : CurrentRoleId,
  'exp' : bigint,
  'name' : string,
  'level' : bigint,
  'badge' : string,
  'is_active' : boolean,
}
export type RoleSelection = { 'Arts' : null } |
  { 'Traveler' : null } |
  { 'Literature' : null } |
  { 'Codes' : null } |
  { 'Sports' : null };
export type ShopError = { 'AlreadyOwned' : null } |
  { 'SkinNotFound' : null } |
  { 'NotAdmin' : null } |
  { 'NotEnoughCoin' : null } |
  { 'UserNotFound' : null };
export interface Skin {
  'id' : SkinId,
  'image_url' : string,
  'name' : string,
  'description' : string,
  'is_limited' : boolean,
  'rarity' : string,
  'price' : bigint,
}
export type SkinId = bigint;
export type Time = bigint;
export type UserError = { 'RoleNotFound' : null } |
  { 'UserNotFound' : null };
export interface UserProfile {
  'username' : string,
  'stamina' : bigint,
  'coin' : bigint,
  'skins' : Array<InventoryItem>,
  'quests' : Array<Quest>,
  'roles' : Array<RoleProfile>,
}
export interface _SERVICE {
  'activateSkin' : ActorMethod<[InventoryId], Result_3>,
  'addSkin' : ActorMethod<
    [string, string, string, string, boolean, bigint],
    Result_4
  >,
  'buySkin' : ActorMethod<[SkinId], Result_3>,
  'chooseRole' : ActorMethod<[RoleSelection], Result_2>,
  'debugInventories' : ActorMethod<
    [],
    Array<[Principal, Array<InventoryItem>]>
  >,
  'debugSkins' : ActorMethod<[], Array<[SkinId, Skin]>>,
  'debugUsers' : ActorMethod<[], Array<[Principal, DebugUser]>>,
  'getInventory' : ActorMethod<[], Array<InventoryItem>>,
  'getProfileUser' : ActorMethod<[], [] | [UserProfile]>,
  'getShop' : ActorMethod<[], Array<Skin>>,
  'grantCoin' : ActorMethod<[Principal, bigint], Result_1>,
  'grantCoinByUsername' : ActorMethod<[string, bigint], Result_1>,
  'isUserExists' : ActorMethod<[], boolean>,
  'registerUser' : ActorMethod<[string], Result>,
  'whoami' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
