// ====== KONFIGURASI CANISTER ID (LOCAL) ======
export const FRONTEND_CANISTER_ID = "u6s2n-gx777-77774-qaaba-cai";
export const BACKEND_CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai";
export const II_CANISTER_ID = "uzt4z-lp777-77774-qaabq-cai";

// ====== KONFIGURASI ENVIRONMENT (LOCAL SAJA) ======
export const IS_LOCAL = true;

// ====== INTERNET IDENTITY LOCAL ======
export const II_URL = `http://${II_CANISTER_ID}.localhost:4943`;

// ====== NETWORK HOST (LOCAL SAJA) ======
export const NETWORK_HOST = "http://127.0.0.1:4943";

// ====== EXPORT DEFAULT ======
export default {
  FRONTEND_CANISTER_ID,
  BACKEND_CANISTER_ID,
  II_CANISTER_ID,
  II_URL,
  IS_LOCAL,
  NETWORK_HOST,
};
