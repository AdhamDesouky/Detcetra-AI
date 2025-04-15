from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base

class ReviewStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.DRAFT, nullable=False)
    findings = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    diagnosis = Column(String, nullable=True)
    confidence_level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews") 