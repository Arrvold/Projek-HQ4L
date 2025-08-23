// ====== GANTI 3 KONSTANTA BERIKUT ======
// Ambil dari output: `dfx deploy` / `dfx canister id <name>`

export const FRONTEND_CANISTER_ID = "u6s2n-gx777-77774-qaaba-cai";
export const BACKEND_CANISTER_ID  = "uxrrr-q7777-77774-qaaaq-cai";
export const II_CANISTER_ID       = "uzt4z-lp777-77774-qaabq-cai";

// URL II lokal cocok untuk AuthClient
export const II_URL = `http://${II_CANISTER_ID}.localhost:4943`;

// Local dev?
export const IS_LOCAL = true;