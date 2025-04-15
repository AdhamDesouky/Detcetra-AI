from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    findings: str
    conclusion: str
    status: str

class ReviewCreate(ReviewBase):
    case_id: int

class ReviewUpdate(BaseModel):
    findings: Optional[str] = None
    conclusion: Optional[str] = None
    status: Optional[str] = None

class Review(ReviewBase):
    id: int
    reviewer_id: int
    case_id: int
    created_at: datetime

    class Config:
        orm_mode = True 