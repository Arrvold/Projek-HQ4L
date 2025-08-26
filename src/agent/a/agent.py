import asyncio
import re
from uuid import uuid4
from datetime import datetime, timezone

from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,
)

# ===============================================================
# 1. PENGATURAN & KONFIGURASI
# Ganti dengan path dfx di dalam WSL Anda (hasil dari `which dfx`)
# ===============================================================
DFX_PATH = "/home/albary/.local/share/dfx/bin/dfx"
CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai"


# ===============================================================
# 2. FUNGSI UNTUK BERINTERAKSI DENGAN ICP CANISTER
# ===============================================================

async def call_icp_via_dfx(ctx: Context) -> dict:
    """
    Memanggil canister ICP dari Windows dengan mengeksekusi dfx di dalam WSL
    menggunakan perintah 'wsl.exe'.
    """
    # Perintah ini akan dibaca sebagai: wsl /path/to/dfx canister call ...
    cmd = ["wsl", DFX_PATH, "canister", "call", CANISTER_ID, "getShop"]
    ctx.logger.info(f"Running command via wsl.exe: {' '.join(cmd)}")
    
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            error_msg = stderr.decode('utf-8', errors='ignore').strip()
            if not error_msg:
                error_msg = stdout.decode('utf-8', errors='ignore').strip()
            raise Exception(f"WSL dfx command failed: {error_msg}")

        output = stdout.decode('utf-8', errors='ignore').strip()
        
        # Membersihkan output dari pesan sistem dfx
        if "Decryption complete." in output:
            output = output.split("Decryption complete.")[-1].strip()
            
        return {"success": True, "data": output}

    except FileNotFoundError:
        raise Exception("Command 'wsl.exe' not found. Please ensure WSL is installed correctly.")
    except Exception as e:
        raise Exception(f"WSL dfx call failed: {e}")

# FUNGSI PARSE TETAP SAMA
def parse_candid_record(record_str: str) -> dict:
    """Mengubah string 'record { ... }' dari Candid menjadi dictionary."""
    data_dict = {}
    # Pola ini sudah cukup baik untuk mengambil key-value dari dalam satu record
    pattern = re.compile(r'(\w+)\s*=\s*(?:"(.*?)"|(\d+)\s*:\s*\w+)')
    matches = pattern.findall(record_str)
    for match in matches:
        key = match[0]
        value = match[1] if match[1] else match[2]
        data_dict[key] = value
    return data_dict

# GANTI FUNGSI INI DENGAN VERSI BARU YANG LEBIH ROBUST
def format_shop_response_dfx(raw_data: str, ctx: Context) -> str:
    """Parse bagian 'available' dengan metode yang lebih kuat."""
    try:
        # 1. Temukan blok 'available'. Ubah (.*?) menjadi (.*) agar menjadi 'greedy'.
        items_block_match = re.search(r"available\s*=\s*vec\s*\{(.*)\};?", raw_data, re.DOTALL)

        if not items_block_match:
            return "🏪 **Shop:**\nTidak ada skin yang tersedia."

        # 2. Ambil konten di dalam 'vec { ... }'
        content = items_block_match.group(1)

        # 3 & 4. Cek jika konten kosong
        if not content.strip():
            return "🏪 **Shop:**\nTidak ada skin yang tersedia untuk dijual saat ini."

        # 5. Temukan semua blok record di dalam konten 'vec' (ini sudah benar)
        records_raw = re.findall(r'record\s*\{(.*?)\};?', content, re.DOTALL)

        # 6. Ubah setiap record mentah menjadi dictionary
        available_skins = [parse_candid_record(r) for r in records_raw]
        
        if not available_skins:
            return "🏪 **Shop:**\nTidak ada skin yang tersedia untuk dijual saat ini."

        # 7. Olah daftar dictionary untuk membuat respons teks
        response_text = "🏪 **Skin yang Tersedia di HQ4L**\n\n"
        for i, skin in enumerate(available_skins):
            response_text += f"**{i+1}. {skin.get('name', 'N/A')}**\n"
            response_text += f"   \nDeskripsi: *{skin.get('description', 'Tidak ada deskripsi')}*\n"
            if skin.get('image_url'):
                response_text += f"  \n  [Lihat Gambar]({skin.get('image_url')})\n"
            response_text += f"   \nHarga: **{skin.get('price', 'N/A')}** koin\n"
            response_text += "\n"
        return response_text

    except Exception as e:
        ctx.logger.error(f"Gagal mem-parsing dfx response: {e}")
        return f"🏪 **Shop Data (Raw):**\n\n```{raw_data}```\n\n*Gagal memformat respons: {e}*"


# ===============================================================
# 3. LOGIKA UTAMA PEMROSESAN PESAN
# ===============================================================

async def process_query(query: str, ctx: Context) -> str:
    """Memproses query pengguna dan memanggil fungsi ICP yang sesuai."""
    query_lower = query.lower()

    if any(keyword in query_lower for keyword in ["shop", "lihat shop", "toko", "skin"]):
        ctx.logger.info("Processing shop query...")
        try:
            result = await call_icp_via_dfx(ctx)
            return format_shop_response_dfx(result["data"], ctx)
        except Exception as dfx_error:
            ctx.logger.error(f"dfx call failed: {dfx_error}")
            return f"""❌ **Gagal mengambil data shop.**

**Error:** `{dfx_error}`

**Langkah Troubleshooting:**
1. Pastikan `dfx` sedang berjalan di WSL: `dfx start --background`
2. Pastikan `DFX_PATH` di dalam skrip sudah benar.
3. Coba panggil canister secara manual dari PowerShell/CMD:
   `wsl {DFX_PATH} canister call {CANISTER_ID} getShop`
"""
    
    elif any(keyword in query_lower for keyword in ["buy", "beli"]):
        return "🚫 **Fungsi pembelian dinonaktifkan.**\n\nAnda hanya dapat melihat skin yang tersedia."
    
    else:
        return """🎮 **Perintah Game Agent:**

• `lihat shop` / `toko` / `skin` - Melihat skin yang tersedia.

*Catatan: Fungsi pembelian saat ini dinonaktifkan.*"""


# ===============================================================
# 4. DEFINISI DAN PROTOKOL AGENT
# ===============================================================

agent = Agent(name="game-agent", port=8002, mailbox=True)
chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.now(timezone.utc), acknowledged_msg_id=msg.msg_id))
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"Started chat session with {sender}")
            welcome_msg = ChatMessage(
                timestamp=datetime.now(timezone.utc), msg_id=uuid4(),
                content=[TextContent(type="text", text="""🎮 **Selamat Datang di Game Agent!**

Saya dapat membantu Anda berinteraksi dengan smart contract game.
Ketik `shop` atau `lihat shop` untuk melihat item yang tersedia.
""")]
            )
            await ctx.send(sender, welcome_msg)
        elif isinstance(item, TextContent):
            ctx.logger.info(f"Processing message from {sender}: {item.text}")
            response_text = await process_query(item.text, ctx)
            response = ChatMessage(
                timestamp=datetime.now(timezone.utc), msg_id=uuid4(),
                content=[TextContent(type="text", text=response_text)]
            )
            await ctx.send(sender, response)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Message {msg.acknowledged_msg_id} acknowledged by {sender}")

agent.include(chat_proto)


# ===============================================================
# 5. TITIK MASUK UNTUK MENJALANKAN AGENT
# ===============================================================

if __name__ == "__main__":
    print("🚀 Memulai Game Agent...")
    print(f"   - 📦 Canister ID: {CANISTER_ID}")
    print(f"   - 🛠️ Path DFX di WSL: {DFX_PATH}")
    print("="*60)
    agent.run()