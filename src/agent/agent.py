from fastapi import FastAPI, Request
import google.generativeai as genai
import os
import json

app = FastAPI()

# Setup API Key Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# nanti disini ada link untuk tembak ke agentverse pake endpoint function_id 

@app.post("/generate-quest")
async def generate_quest(request: Request):
    data = await request.json()
    role = data.get("role", "Coders")
    level = data.get("level", 1)
    desc = data.get("desc", "")

    prompt = f"""
    Anda adalah seorang Game Master yang bertugas menciptakan quest harian untuk membantu pengguna membentuk kebiasaan baik.

    Berdasarkan informasi berikut:
    * Role Pengguna: {role}
    * Level Pengguna: {level}
    * Deskripsi Role: {desc}

    Tugas Anda:
    Ciptakan satu (1) quest harian yang relevan, jelas, dan dapat dilakukan oleh pengguna. Quest ini harus:
    1. Sesuai dengan level pengguna: Quest untuk level rendah harus mudah dan sederhana, sedangkan quest untuk level tinggi harus lebih menantang dan kompleks.
    2. Menentukan atribut sebagai reward dan cost:
       * Stamina: Biaya yang dibutuhkan untuk menjalankan quest. Nilai: 1-10.
       * EXP: Poin pengalaman yang didapat. Nilai: 1-100.
       * Coin: Mata uang dalam game yang didapat. Nilai: 1-100.
    3. Mematuhi aturan reward dan cost: Semakin sulit quest, semakin tinggi nilai Stamina, EXP, dan Coin. Sebaliknya, semakin mudah quest, semakin rendah nilainya.

    Format Output:
    Berikan output dalam format JSON agar mudah diproses oleh sistem. Pastikan tidak ada teks tambahan, hanya objek JSON saja.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # parse output ke JSON
    try:
        quest = json.loads(response.text)
    except:
        quest = {"error": "Response bukan JSON valid", "raw": response.text}

    return quest
