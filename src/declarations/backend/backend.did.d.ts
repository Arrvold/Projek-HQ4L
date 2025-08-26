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
export interface InventoryItemWithSkin {
  'id' : InventoryId,
  'skin' : Skin,
  'user_id' : UserId,
  'acquired_at' : Time,
  'is_active' : boolean,
}
export interface LeaderboardEntry {
  'exp' : bigint,
  'username' : string,
  'skin' : [] | [Skin],
  'user_id' : UserId,
  'level' : bigint,
}
export interface LeaderboardResponse {
  'topLeaderboard' : Array<LeaderboardEntry>,
  'myLeaderboard' : [] | [LeaderboardEntry],
}
export type QuestStatus = { 'Failed' : null } |
  { 'OnProgress' : null } |
  { 'Completed' : null };
export interface QuestView {
  'id' : bigint,
  'status' : QuestStatus,
  'title' : string,
  'exp_reward' : bigint,
  'accepted_at' : Time,
  'description' : string,
  'deadline' : Time,
  'user_id' : UserId,
  'stamina_cost' : bigint,
  'coin_reward' : bigint,
}
export type RegistrationError = { 'UsernameTaken' : null } |
  { 'AlreadyRegistered' : null };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : [UserView, Array<CurrentRoleView>] } |
  { 'err' : RegistrationError };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : UserError };
export type Result_3 = { 'ok' : null } |
  { 'err' : UserError };
export type Result_4 = { 'ok' : null } |
  { 'err' : ShopError };
export type Result_5 = { 'ok' : SkinId } |
  { 'err' : ShopError };
export type RoleId = bigint;
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
export interface ShopView { 'owned' : Array<Skin>, 'available' : Array<Skin> }
export interface Skin {
  'id' : SkinId,
  'image_url' : string,
  'name' : string,
  'description' : string,
  'price' : bigint,
}
export type SkinId = bigint;
export type Time = bigint;
export type UserError = { 'ActiveQuestExists' : null } |
  { 'QuestNotFound' : null } |
  { 'QuestNotInProgress' : null } |
  { 'NotEnoughStamina' : null } |
  { 'RoleNotFound' : null } |
  { 'NoActiveRole' : null } |
  { 'UserNotFound' : null };
export type UserId = bigint;
export interface UserProfileView {
  'user' : UserView,
  'active_inventory' : [] | [InventoryItemWithSkin],
  'roles' : Array<CurrentRoleView>,
}
export interface UserView {
  'id' : UserId,
  'username' : string,
  'stamina' : bigint,
  'coin' : bigint,
  'last_action_timestamp' : Time,
  'quests' : Array<QuestView>,
  'owner_principal' : Principal,
}
export interface _SERVICE {
  'acceptQuest' : ActorMethod<
    [string, string, bigint, bigint, bigint],
    Result_3
  >,
  'addSkin' : ActorMethod<[string, string, string, bigint], Result_5>,
  'buySkin' : ActorMethod<[SkinId], Result_4>,
  'chooseRole' : ActorMethod<[RoleSelection], Result_3>,
  'completeQuest' : ActorMethod<[bigint], Result>,
  'detailQuest' : ActorMethod<[bigint], [] | [QuestView]>,
  'failExpiredQuests' : ActorMethod<[], undefined>,
  'getCoins' : ActorMethod<[], Result_2>,
  'getInventory' : ActorMethod<[], Array<InventoryItemWithSkin>>,
  'getLeaderboardAllUserByRole' : ActorMethod<[RoleId], LeaderboardResponse>,
  'getProfileUser' : ActorMethod<[], [] | [UserProfileView]>,
  'getShop' : ActorMethod<[], ShopView>,
  'getStamina' : ActorMethod<[], Result_2>,
  'grantCoinByUsername' : ActorMethod<[string, bigint], Result>,
  'historyQuest' : ActorMethod<
    [],
    {
      'completed' : Array<QuestView>,
      'onProgress' : Array<QuestView>,
      'failed' : Array<QuestView>,
    }
  >,
  'isUserExists' : ActorMethod<[], boolean>,
  'registerUser' : ActorMethod<[string], Result_1>,
  'setActiveInventory' : ActorMethod<[InventoryId], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
