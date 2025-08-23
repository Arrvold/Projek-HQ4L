export const idlFactory = ({ IDL }) => {
  const SkinId = IDL.Nat;
  const ShopError = IDL.Variant({
    'AlreadyOwned' : IDL.Null,
    'SkinNotFound' : IDL.Null,
    'NotAdmin' : IDL.Null,
    'NotEnoughCoin' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const Result_4 = IDL.Variant({ 'ok' : SkinId, 'err' : ShopError });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Null, 'err' : ShopError });
  const RoleSelection = IDL.Variant({
    'Arts' : IDL.Null,
    'Traveler' : IDL.Null,
    'Literature' : IDL.Null,
    'Codes' : IDL.Null,
    'Sports' : IDL.Null,
  });
  const UserError = IDL.Variant({
    'RoleNotFound' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : UserError });
  const InventoryId = IDL.Nat;
  const Time = IDL.Int;
  const InventoryItem = IDL.Record({
    'id' : InventoryId,
    'skin_id' : SkinId,
    'acquired_at' : Time,
    'is_active' : IDL.Bool,
  });
  const UserId = IDL.Nat;
  const QuestId = IDL.Nat;
  const Quest = IDL.Record({
    'id' : QuestId,
    'title' : IDL.Text,
    'exp_reward' : IDL.Nat,
    'stamina_cost' : IDL.Nat,
    'is_active' : IDL.Bool,
    'coin_reward' : IDL.Nat,
  });
  const UserView = IDL.Record({
    'id' : UserId,
    'username' : IDL.Text,
    'stamina' : IDL.Nat,
    'coin' : IDL.Nat,
    'skins' : IDL.Vec(InventoryItem),
    'last_action_timestamp' : Time,
    'quests' : IDL.Vec(Quest),
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
    'roles' : IDL.Vec(CurrentRoleView),
  });
  const Skin = IDL.Record({
    'id' : SkinId,
    'image_url' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'is_limited' : IDL.Bool,
    'rarity' : IDL.Text,
    'price' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const RegistrationError = IDL.Variant({
    'UsernameTaken' : IDL.Null,
    'AlreadyRegistered' : IDL.Null,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(UserView, IDL.Vec(CurrentRoleView)),
    'err' : RegistrationError,
  });
  return IDL.Service({
    'addSkin' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Nat],
        [Result_4],
        [],
      ),
    'buySkin' : IDL.Func([SkinId], [Result_3], []),
    'chooseRole' : IDL.Func([RoleSelection], [Result_2], []),
    'getInventory' : IDL.Func([], [IDL.Vec(InventoryItem)], ['query']),
    'getProfileUser' : IDL.Func([], [IDL.Opt(UserProfileView)], ['query']),
    'getShop' : IDL.Func([], [IDL.Vec(Skin)], ['query']),
    'grantCoin' : IDL.Func([IDL.Principal, IDL.Nat], [Result_1], []),
    'grantCoinByUsername' : IDL.Func([IDL.Text, IDL.Nat], [Result_1], []),
    'isUserExists' : IDL.Func([], [IDL.Bool], ['query']),
    'registerUser' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
