# WhatsApp AI Business Assistant

Production-style AI SaaS platform for AI-powered WhatsApp customer support, lead generation, memory, and business automation.

---

# Live Demo

Frontend (Vercel):
https://whatsapp-ai-business-assistant.vercel.app

Backend (Render):
https://whatsapp-ai-business-assistant.onrender.com

---

# Features

- AI-powered WhatsApp conversations
- OpenAI-generated responses
- Conversation memory
- Lead capture system
- Supabase database integration
- Authentication system
- Protected SaaS dashboard
- Realtime dashboard updates
- Search and filtering
- CSV export
- Cloud deployment
- Modern SaaS UI
- Twilio WhatsApp integration

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Supabase Client
- Lucide React

## Backend
- Python
- FastAPI
- OpenAI API
- Twilio Webhooks

## Database
- Supabase PostgreSQL

## Deployment
- Vercel
- Render
- GitHub

---

# Architecture

WhatsApp User
↓
Twilio WhatsApp Sandbox
↓
FastAPI Backend
↓
OpenAI API
↓
Supabase Database + Memory
↓
Next.js SaaS Dashboard

---

# Dashboard Features

- Total leads analytics
- Realtime lead updates
- Customer conversation viewer
- AI response monitoring
- Search functionality
- CSV export
- Authentication and logout
- Responsive SaaS interface

---

# Supabase Tables

## leads

| Column | Type |
|---|---|
| id | UUID |
| phone_number | Text |
| customer_message | Text |
| ai_reply | Text |
| created_at | Timestamp |

## conversations

| Column | Type |
|---|---|
| id | UUID |
| phone_number | Text |
| role | Text |
| message | Text |
| created_at | Timestamp |

---

# Local Development

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload
```

---

# Environment Variables

## Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

## Backend (.env)

```env
OPENAI_API_KEY=your_openai_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

---

# Future Improvements

- Stripe subscriptions
- Multi-tenant SaaS support
- AI analytics dashboard
- Voice AI integration
- Vector database / RAG memory
- Multi-agent workflows
- Organization/team accounts

---

# Author

Bala Subramanyam Pallapothu

AI Engineer | Full Stack AI Developer | Generative AI Enthusiast

---

# License

MIT License