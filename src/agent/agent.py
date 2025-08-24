import os
import json
import google.generativeai as genai
from uagents import Agent, Context, Protocol, Model
from uagents_core.contrib.protocols.chat import ChatMessage

# 🔑 Setup Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# 🔑 Setup Agent
agent = Agent(
    name="quest_agent",
    seed="quest-agent-secret",
    port=8001,
    endpoint=["http://127.0.0.1:8000/submit"],
)

# 📝 Model input untuk generate quest
class QuestRequest(Model):
    role: str
    level: int
    desc: str

# ⚔️ Chat Protocol
chat_protocol = Protocol("Chat", "1.0")

@chat_protocol.on_message(model=ChatMessage)
async def handle_chat(ctx: Context, sender: str, msg: ChatMessage):
    """
    Kalau user kirim chat → kita balas dengan 5 quest.
    """
    ctx.logger.info(f"Chat masuk dari {sender}: {msg.text}")

    # Prompt untuk generate 5 quest
    prompt = f"""
    Anda adalah seorang Game Master yang bertugas menciptakan quest harian untuk membantu pengguna membentuk kebiasaan baik.

    Buatkan **5 quest harian** berdasarkan informasi:
    * Role Pengguna: {msg.text or "Coders"}
    * Level Pengguna: 1
    * Deskripsi Role: Sesuaikan dengan role di atas

    Aturan:
    1. Quest untuk level rendah mudah, quest untuk level tinggi lebih menantang.
    2. Setiap quest punya atribut:
       - Stamina (1-10)
       - EXP (1-100)
       - Coin (1-100)
    3. Output harus berupa **array JSON berisi 5 objek quest**, tidak boleh ada teks tambahan.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    try:
        quests = json.loads(response.text)
    except Exception:
        quests = {"error": "Response bukan JSON valid", "raw": response.text}

    await ctx.send(sender, ChatMessage(text=json.dumps(quests, indent=2)))


# 📝 Protocol khusus untuk permintaan "generate quest"
quest_protocol = Protocol("QuestProtocol", "1.0")

@quest_protocol.on_message(model=QuestRequest)
async def generate_quest(ctx: Context, sender: str, req: QuestRequest):
    """
    Kalau user kirim permintaan generate quest via protokol QuestProtocol.
    """
    ctx.logger.info(f"QuestRequest diterima dari {sender}: {req}")

    prompt = f"""
    Anda adalah Game Master. Buatkan **5 quest harian** untuk role:
    * Role: {req.role}
    * Level: {req.level}
    * Deskripsi: {req.desc}

    Output harus array JSON berisi 5 objek quest.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    try:
        quests = json.loads(response.text)
    except Exception:
        quests = {"error": "Response bukan JSON valid", "raw": response.text}

    await ctx.send(sender, QuestRequest(role=req.role, level=req.level, desc=json.dumps(quests)))


# 🏗️ Include protocols ke agent
agent.include(chat_protocol)
agent.include(quest_protocol)

if __name__ == "__main__":
    agent.run()