from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import logging
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup Gemini dengan API Key langsung di kode
GEMINI_API_KEY = "AIzaSyAt3bQKGdBpo7VRpxik-KsGbGUK8FTyYts"
genai.configure(api_key=GEMINI_API_KEY)

# === REST API ===
app = FastAPI(title="Quest Generator API", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestInput(BaseModel):
    role: str
    level: int
    desc: str

@app.post("/quest")
async def quest_api(data: QuestInput):
    try:
        logger.info(f"Received quest request: role={data.role}, level={data.level}")
        
        # Create prompt for quest generation
        prompt = f"""
        Anda adalah seorang Game Master yang bertugas menciptakan quest harian untuk membantu pengguna membentuk kebiasaan baik.

        Buatkan **5 quest harian** berdasarkan informasi:
        * Role Pengguna: {data.role}
        * Level Pengguna: {data.level}
        * Deskripsi Role: {data.desc}

        Aturan:
        1. Quest untuk level rendah mudah, quest untuk level tinggi lebih menantang.
        2. Setiap quest punya atribut:
           - Stamina (1-10)
           - EXP (1-100)
           - Coin (1-100)
        3. Output harus berupa **array JSON berisi 5 objek quest**, tidak boleh ada teks tambahan.
        4. Format JSON yang harus diikuti:
        [
            {{
                "judul": "Judul Quest yang Menarik",
                "deskripsi_quest": "Deskripsi tugas yang harus dilakukan oleh pengguna.",
                "stamina": [nilai_stamina],
                "exp": [nilai_exp],
                "coin": [nilai_coin]
            }}
        ]
        5. Pastikan masing-masing quest berbeda satu sama lain dengan variasi yang menarik.
        """
        
        logger.info("Generating quests with Gemini AI...")
        
        # Generate quests using Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        logger.info("Response received from Gemini AI")
        
        # Parse response
        try:
            quests = json.loads(response.text)
            logger.info(f"Generated {len(quests)} quests successfully")
            
            return {
                "success": True,
                "quests": quests,
                "raw_response": response.text
            }
            
        except json.JSONDecodeError as e:
            logger.warning(f"Response is not valid JSON: {e}")
            logger.warning(f"Raw response: {response.text}")
            
            # Try to extract JSON from response
            try:
                # Look for JSON array in the response
                import re
                json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
                if json_match:
                    quests = json.loads(json_match.group())
                    return {
                        "success": True,
                        "quests": quests,
                        "raw_response": response.text
                    }
            except:
                pass
            
            # Return raw response if JSON parsing fails
            return {
                "success": True,
                "quests": response.text,
                "raw_response": response.text
            }
        
    except Exception as e:
        logger.error(f"Error generating quests: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "quest-generator-api"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Simple AI Quest Client API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)