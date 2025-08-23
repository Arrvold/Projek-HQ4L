import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type CurrentRoleId = bigint;
export interface CurrentRoleView {
  'id' : CurrentRoleId,
  'exp' : bigint,
  'level' : bigint,
  'role_name' : string,
  'is_active' : boolean,
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
export type Result = { 'ok' : [UserView, Array<CurrentRoleView>] } |
  { 'err' : RegistrationError };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : UserError };
export type Result_3 = { 'ok' : null } |
  { 'err' : ShopError };
export type Result_4 = { 'ok' : SkinId } |
  { 'err' : ShopError };
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
export type UserId = bigint;
export interface UserProfileView {
  'user' : UserView,
  'roles' : Array<CurrentRoleView>,
}
export interface UserView {
  'id' : UserId,
  'username' : string,
  'stamina' : bigint,
  'coin' : bigint,
  'skins' : Array<InventoryItem>,
  'last_action_timestamp' : Time,
  'quests' : Array<Quest>,
  'owner_principal' : Principal,
}
export interface _SERVICE {
  'addSkin' : ActorMethod<
    [string, string, string, string, boolean, bigint],
    Result_4
  >,
  'buySkin' : ActorMethod<[SkinId], Result_3>,
  'chooseRole' : ActorMethod<[RoleSelection], Result_2>,
  'getInventory' : ActorMethod<[], Array<InventoryItem>>,
  'getProfileUser' : ActorMethod<[], [] | [UserProfileView]>,
  'getShop' : ActorMethod<[], Array<Skin>>,
  'grantCoin' : ActorMethod<[Principal, bigint], Result_1>,
  'grantCoinByUsername' : ActorMethod<[string, bigint], Result_1>,
  'isUserExists' : ActorMethod<[], boolean>,
  'registerUser' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
