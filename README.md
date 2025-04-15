# Detcetra

A web application for AI-assisted biomedical imaging analysis.

## Project Structure

```
detcetra/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── schemas/         # Pydantic models
│   ├── static/          # Static files
│   ├── .env            # Environment variables
│   └── requirements.txt # Python dependencies
└── frontend/            # React frontend
    ├── public/          # Static files
    ├── src/             # Source code
    └── package.json     # Node dependencies
```

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Initialize the database:
```bash
python -m database.init_db
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Default Users

- Admin:
  - Email: admin@example.com
  - Password: admin123

- Radiologist:
  - Email: radiologist@example.com
  - Password: radiologist123

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000
- CORS is configured to allow communication between frontend and backend 