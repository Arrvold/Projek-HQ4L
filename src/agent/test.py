import os
import requests
from uagents import Agent, Context, Model
from uagents import Context, Protocol, Agent
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

# ===== Bagian yang benar =====
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or "ISI_API_KEY_GEMINI"
# AGENTVERSE_API_KEY tidak digunakan dalam skenario lokal ini, jadi bisa diabaikan atau diperbaiki juga.
AGENTVERSE_API_KEY = os.getenv("AGENTVERSE_API_KEY") or "ISI_API_KEY_AGENTVERSE"

# Gemini endpoint
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

# ===== Data Models =====
class QuestRequest(Model):
    action: str

class QuestResponse(Model):
    title: str
    description: str
    reward: int

# ===== Agent Setup =====
agent = Agent(
    name="quest-gen",
    seed="quest-gen-seed",
    endpoint=["http://127.0.0.1:8000/submit"],   # bisa diganti public endpoint kalau deploy
    api_key=AGENTVERSE_API_KEY
)

# ===== Quest Protocol =====
@agent.on_message(model=QuestRequest, replies=QuestResponse)
async def on_quest(ctx: Context, sender: str, msg: QuestRequest):
    if msg.action == "generate":
        payload = {
            "contents": [{
                "parts": [{"text": "Buatkan quest RPG sederhana (judul, deskripsi, reward angka)."}]
            }]
        }

        r = requests.post(GEMINI_URL, json=payload)
        data = r.json()

        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            ctx.logger.error(f"Error parsing Gemini response: {e}")
            return

        # Parsing sederhana
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        title = lines[0].replace("Judul:", "").strip()
        desc = lines[1].replace("Deskripsi:", "").strip()
        reward = int(lines[2].replace("Reward:", "").strip())

        quest = QuestResponse(title=title, description=desc, reward=reward)
        await ctx.send(sender, quest)

# ===== Chat Protocol =====
chat_protocol = Protocol("Chat", "1.0")

@chat_protocol.on_message(model=ChatMessage)
async def on_chat(ctx: Context, sender: str, msg: ChatMessage):
    user_text = msg.text.strip()
    ctx.logger.info(f"User said: {user_text}")

    # kalau user minta quest → panggil Gemini
    if "quest" in user_text.lower():
        payload = {
            "contents": [{
                "parts": [{"text": "Buatkan quest RPG sederhana (judul, deskripsi, reward angka)."}]
            }]
        }
        r = requests.post(GEMINI_URL, json=payload)
        data = r.json()
        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            await ctx.send(sender, f"⚠️ Error dari Gemini: {e}")
            return

        await ctx.send(sender, f"🎮 Quest yang dihasilkan:\n{text}")

    else:
        # fallback → jawab pakai Gemini bebas
        payload = {
            "contents": [{
                "parts": [{"text": f"Jawab pesan berikut secara singkat: {user_text}"}]
            }]
        }
        r = requests.post(GEMINI_URL, json=payload)
        data = r.json()
        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            text = "⚠️ Gagal mendapatkan respon dari Gemini."

        await ctx.send(sender, text)

# attach ChatProtocol ke agent
agent.include(chat_protocol)

# ===== Run Agent =====
if __name__ == "__main__":
    agent.run()
