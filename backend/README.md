# Tattva AI Backend (Express Foundation)

This backend provides a clean Express.js API foundation for the Tattva AI project.

## Prerequisites
- Node.js (LTS recommended)

## Setup
```bash
cd backend
npm install
```

## Environment Variables
Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` to match your environment. **Do not add secrets here for this template.**

## Start (Development)
```bash
npm run dev
```

Server runs on `PORT` (default: 3000).

## API Endpoints (Placeholders)
- `GET  /api/health`
- `POST /api/summarize/text`
- `POST /api/summarize/youtube`
- `POST /api/ocr`
- `POST /api/notes/from-image`
- `POST /api/chat`

Each endpoint currently returns:
```json
{
  "success": true,
  "message": "Endpoint created. AI implementation pending."
}
```

