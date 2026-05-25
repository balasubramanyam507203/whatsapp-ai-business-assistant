from fastapi import FastAPI, Form
from fastapi.responses import Response
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "WhatsApp AI Business Assistant backend is running"
    }


def save_conversation(phone_number: str, role: str, message: str):
    try:
        supabase.table("conversations").insert({
            "phone_number": phone_number,
            "role": role,
            "message": message
        }).execute()
        print(f"{role} message saved")
    except Exception as e:
        print("Conversation Save Error:", e)


def get_conversation_history(phone_number: str):
    try:
        response = (
            supabase
            .table("conversations")
            .select("role, message")
            .eq("phone_number", phone_number)
            .order("created_at", desc=True)
            .limit(6)
            .execute()
        )

        history = response.data[::-1]

        messages = []

        for item in history:
            messages.append({
                "role": item["role"],
                "content": item["message"]
            })

        return messages

    except Exception as e:
        print("Conversation Fetch Error:", e)
        return []


@app.post("/whatsapp")
async def whatsapp_webhook(
    Body: str = Form(...),
    From: str = Form(...)
):
    print("Message received:", Body)
    print("From:", From)

    save_conversation(From, "user", Body)

    history_messages = get_conversation_history(From)

    system_prompt = {
        "role": "system",
        "content": """
You are WhatsApp AI Business Assistant, a professional AI assistant for a software development agency.

Your job:
1. Answer customer questions about AI development, chatbots, automation, websites, and software projects.
2. Collect lead information naturally.
3. Ask only one question at a time.
4. Keep WhatsApp replies short, friendly, and professional.
5. Move the conversation toward lead capture.

Ask for these details step by step:
- business name
- project requirement
- budget range
- timeline
- email address

Agency services:
- AI chatbots
- WhatsApp automation
- RAG applications
- AI agents
- business automation
- web applications
- dashboards

If the user asks pricing, say:
"Pricing depends on features, integrations, and timeline. Could you share your main requirement first?"

Never give long paragraphs.
"""
    }

    try:
        ai_response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_prompt] + history_messages,
            temperature=0.7,
            max_tokens=150
        )

        reply = ai_response.choices[0].message.content

    except Exception as e:
        print("OpenAI Error:", e)
        reply = "Sorry, I’m having trouble responding right now. Please try again shortly."

    save_conversation(From, "assistant", reply)

    try:
        supabase.table("leads").insert({
            "phone_number": From,
            "customer_message": Body,
            "ai_reply": reply
        }).execute()

        print("Lead saved to Supabase")

    except Exception as e:
        print("Supabase Error:", e)

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply}</Message>
</Response>"""

    return Response(content=twiml, media_type="text/xml")