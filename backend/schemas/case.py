from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class CaseStatus(str, Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ReviewStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

class CaseBase(BaseModel):
    patient_id: str = Field(..., description="Patient's unique identifier")
    patient_name: str = Field(..., description="Patient's full name")
    patient_age: int = Field(..., description="Patient's age")
    patient_gender: str = Field(..., description="Patient's gender")
    case_number: str = Field(..., description="Unique case number")
    notes: Optional[str] = Field(None, description="Additional notes about the case")

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[CaseStatus] = None

class ReviewBase(BaseModel):
    findings: Optional[str] = Field(None, description="Radiological findings")
    recommendations: Optional[str] = Field(None, description="Clinical recommendations")
    diagnosis: Optional[str] = Field(None, description="Final diagnosis")
    confidence_level: Optional[str] = Field(None, description="Confidence level in diagnosis")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    case_id: int
    reviewer_id: int
    status: ReviewStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CaseResponse(CaseBase):
    id: int
    status: CaseStatus
    image_path: Optional[str]
    report_path: Optional[str]
    heatmap_path: Optional[str]
    creator_id: int
    reviewer_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    reviews: List[ReviewResponse] = []

    class Config:
        orm_mode = True 