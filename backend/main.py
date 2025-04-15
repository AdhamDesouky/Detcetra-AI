from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from routes import cases, auth
from database.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Breast Implant DX API",
    description="API for AI-assisted review of breast implant imaging studies",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(cases.router, prefix="/api", tags=["Cases"])

@app.get("/")
async def root():
    return {"message": "Welcome to Breast Implant DX API"}

@app.get("/api/cases")
async def get_cases():
    return JSONResponse(
        content={"cases": [
            {"id": 1, "patient_id": "P001", "status": "pending"},
            {"id": 2, "patient_id": "P002", "status": "reviewed"}
        ]},
        status_code=200
    )

@app.get("/api/reviews")
async def get_reviews():
    return JSONResponse(
        content={"reviews": [
            {"id": 1, "case_id": 1, "reviewer": "Dr. Smith"},
            {"id": 2, "case_id": 2, "reviewer": "Dr. Johnson"}
        ]},
        status_code=200
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 