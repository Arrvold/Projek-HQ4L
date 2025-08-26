import Time "mo:base/Time";

module {
  public type RoleId = Nat;
  public type CurrentRoleId = Nat;
  public type SkinId = Nat;
  public type InventoryId = Nat;
  public type QuestId = Nat;
  public type UserId = Nat;

  // =============================
  // ROLES
  // =============================
  public type Role = {
    id : RoleId;
    name : Text;
    badge : Text;
  };

  public type RoleSelection = {
    #Codes;
    #Sports;
    #Arts;
    #Traveler;
    #Literature;
  };

  public type CurrentRole = {
    id : CurrentRoleId;
    role_id : RoleId;
    user_id : UserId;
    var level : Nat;
    var exp : Nat;
    var is_active : Bool;
  };

  // =============================
  // SHOP & INVENTORY
  // =============================
  public type Skin = {
    id : SkinId;
    name : Text;
    description : Text;
    image_url : Text;
    price : Nat;
  };

  public type InventoryItem = {
    id : InventoryId;
    skin_id : SkinId;
    user_id : UserId;
    is_active : Bool;
    acquired_at : Time.Time;
  };

  public type InventoryItemWithSkin = {
    id : InventoryId;
    user_id : UserId;
    is_active : Bool;
    acquired_at : Time.Time;
    skin : Skin;
  };

  // =============================
  // QUEST
  // =============================
  public type QuestStatus = {
    #OnProgress;
    #Completed;
    #Failed;
  };

  public type Quest = {
    id : Nat;
    user_id : UserId;
    title : Text;
    description : Text;
    stamina_cost : Nat;
    coin_reward : Nat;
    exp_reward : Nat; 
    deadline : Time.Time; // batas waktu quest
    var status : QuestStatus;
    accepted_at : Time.Time;
  };

  // =============================
  // USER (gabungan User + UserProfile)
  // =============================
  public type User = {
    id : UserId;
    owner_principal : Principal;
    username : Text;
    var coin : Nat;
    var stamina : Nat;
    var last_action_timestamp : Time.Time;
    var quests : [Quest];
  };

  // =============================
  // ERRORS
  // =============================

  public type LeaderboardEntry = {
    user_id : UserId;
    username : Text;
    level : Nat;
    exp : Nat;
    skin : ?Skin;
    rank : Nat;
  };

  public type LeaderboardResponse = {
    myLeaderboard : ?LeaderboardEntry;
    topLeaderboard : [LeaderboardEntry];
  };


  // =============================
  // ERRORS
  // =============================
  public type RegistrationError = {
    #UsernameTaken;
    #AlreadyRegistered;
  };

  public type UserError = {
    #UserNotFound;        // user tidak ditemukan (belum register)
    #RoleNotFound;        // role yang dipilih tidak dimiliki user
    #NoActiveRole;        // user tidak punya role aktif
    #NotEnoughStamina;    // stamina tidak cukup untuk aksi
    #ActiveQuestExists;   // tidak bisa ganti role saat masih ada quest aktif
    #QuestNotFound;       // quest yang dicari tidak ada
    #QuestNotInProgress;  // quest ditemukan tapi tidak dalam status OnProgress
  };


  public type ShopError = {
    #UserNotFound;
    #SkinNotFound;
    #AlreadyOwned;
    #NotEnoughCoin;
    #NotAdmin;
  };
};