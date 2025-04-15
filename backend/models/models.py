from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    REVIEWER = "reviewer"
    RADIOLOGIST = "radiologist"

class CaseStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.REVIEWER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    reviews = relationship("Review", back_populates="reviewer")

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    accession_number = Column(String, unique=True, index=True)
    modality = Column(String)
    view = Column(String)
    image_path = Column(String)
    report_path = Column(String)
    status = Column(Enum(CaseStatus), default=CaseStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSON, nullable=True)  # For storing DICOM metadata

    reviews = relationship("Review", back_populates="case")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(CaseStatus))
    feedback = Column(String)
    ai_prediction = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    ai_heatmap_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    case = relationship("Case", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews") 