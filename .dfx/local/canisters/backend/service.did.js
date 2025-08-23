export const idlFactory = ({ IDL }) => {
  const UserError = IDL.Variant({
    'ActiveQuestExists' : IDL.Null,
    'QuestNotFound' : IDL.Null,
    'QuestNotInProgress' : IDL.Null,
    'NotEnoughStamina' : IDL.Null,
    'RoleNotFound' : IDL.Null,
    'NoActiveRole' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Null, 'err' : UserError });
  const SkinId = IDL.Nat;
  const ShopError = IDL.Variant({
    'AlreadyOwned' : IDL.Null,
    'SkinNotFound' : IDL.Null,
    'NotAdmin' : IDL.Null,
    'NotEnoughCoin' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const Result_5 = IDL.Variant({ 'ok' : SkinId, 'err' : ShopError });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Null, 'err' : ShopError });
  const RoleSelection = IDL.Variant({
    'Arts' : IDL.Null,
    'Traveler' : IDL.Null,
    'Literature' : IDL.Null,
    'Codes' : IDL.Null,
    'Sports' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const QuestStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'OnProgress' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Time = IDL.Int;
  const UserId = IDL.Nat;
  const QuestView = IDL.Record({
    'id' : IDL.Nat,
    'status' : QuestStatus,
    'title' : IDL.Text,
    'exp_reward' : IDL.Nat,
    'accepted_at' : Time,
    'description' : IDL.Text,
    'deadline' : Time,
    'user_id' : UserId,
    'stamina_cost' : IDL.Nat,
    'coin_reward' : IDL.Nat,
  });
  const InventoryId = IDL.Nat;
  const InventoryItem = IDL.Record({
    'id' : InventoryId,
    'skin_id' : SkinId,
    'user_id' : UserId,
    'acquired_at' : Time,
    'is_active' : IDL.Bool,
  });
  const RoleId = IDL.Nat;
  const LeaderboardEntry = IDL.Record({
    'exp' : IDL.Nat,
    'username' : IDL.Text,
    'user_id' : UserId,
    'level' : IDL.Nat,
  });
  const InventoryItemView = IDL.Record({
    'id' : InventoryId,
    'skin_id' : SkinId,
    'user_id' : UserId,
    'acquired_at' : Time,
    'is_active' : IDL.Bool,
  });
  const UserView = IDL.Record({
    'id' : UserId,
    'username' : IDL.Text,
    'stamina' : IDL.Nat,
    'coin' : IDL.Nat,
    'skins' : IDL.Vec(InventoryItemView),
    'last_action_timestamp' : Time,
    'quests' : IDL.Vec(QuestView),
    'owner_principal' : IDL.Principal,
  });
  const CurrentRoleId = IDL.Nat;
  const CurrentRoleView = IDL.Record({
    'id' : CurrentRoleId,
    'exp' : IDL.Nat,
    'level' : IDL.Nat,
    'role_name' : IDL.Text,
    'is_active' : IDL.Bool,
  });
  const UserProfileView = IDL.Record({
    'user' : UserView,
    'active_inventory' : IDL.Opt(InventoryItem),
    'roles' : IDL.Vec(CurrentRoleView),
  });
  const Skin = IDL.Record({
    'id' : SkinId,
    'image_url' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'price' : IDL.Nat,
  });
  const ShopView = IDL.Record({
    'owned' : IDL.Vec(Skin),
    'available' : IDL.Vec(Skin),
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : UserError });
  const RegistrationError = IDL.Variant({
    'UsernameTaken' : IDL.Null,
    'AlreadyRegistered' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(UserView, IDL.Vec(CurrentRoleView)),
    'err' : RegistrationError,
  });
  return IDL.Service({
    'acceptQuest' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat],
        [Result_3],
        [],
      ),
    'addSkin' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [Result_5],
        [],
      ),
    'buySkin' : IDL.Func([SkinId], [Result_4], []),
    'chooseRole' : IDL.Func([RoleSelection], [Result_3], []),
    'completeQuest' : IDL.Func([IDL.Nat], [Result], []),
    'detailQuest' : IDL.Func([IDL.Nat], [IDL.Opt(QuestView)], ['query']),
    'failExpiredQuests' : IDL.Func([], [], []),
    'getInventory' : IDL.Func([], [IDL.Vec(InventoryItem)], ['query']),
    'getLeaderboardAllUserByRole' : IDL.Func(
        [RoleId],
        [IDL.Vec(LeaderboardEntry)],
        ['query'],
      ),
    'getProfileUser' : IDL.Func([], [IDL.Opt(UserProfileView)], ['query']),
    'getShop' : IDL.Func([], [ShopView], ['query']),
    'getStamina' : IDL.Func([], [Result_2], []),
    'grantCoinByUsername' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'historyQuest' : IDL.Func(
        [],
        [
          IDL.Record({
            'completed' : IDL.Vec(QuestView),
            'onProgress' : IDL.Vec(QuestView),
            'failed' : IDL.Vec(QuestView),
          }),
        ],
        ['query'],
      ),
    'isUserExists' : IDL.Func([], [IDL.Bool], ['query']),
    'registerUser' : IDL.Func([IDL.Text], [Result_1], []),
    'setActiveInventory' : IDL.Func([InventoryId], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
