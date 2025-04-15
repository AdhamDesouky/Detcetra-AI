from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base

class CaseStatus(str, enum.Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True, nullable=False)
    patient_name = Column(String, nullable=False)
    patient_age = Column(Integer, nullable=False)
    patient_gender = Column(String, nullable=False)
    case_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.PENDING, nullable=False)
    image_path = Column(String, nullable=True)
    report_path = Column(String, nullable=True)
    heatmap_path = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    creator = relationship("User", foreign_keys=[creator_id], back_populates="created_cases")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviewed_cases")
    reviews = relationship("Review", back_populates="case") 