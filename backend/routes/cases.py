from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database.database import get_db
from models.models import User, Case, Review, CaseStatus, ReviewStatus
from schemas.case import CaseCreate, CaseUpdate, CaseResponse, ReviewCreate, ReviewResponse
from auth.auth import get_current_active_user
from services.storage import StorageService

router = APIRouter()
storage_service = StorageService()

@router.post("/cases/", response_model=CaseResponse)
async def create_case(
    case: CaseCreate,
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Save the uploaded image
    image_path = await storage_service.save_image(image, str(case.patient_id))
    
    # Create new case
    db_case = Case(
        patient_id=case.patient_id,
        patient_name=case.patient_name,
        patient_age=case.patient_age,
        patient_gender=case.patient_gender,
        case_number=case.case_number,
        image_path=image_path,
        creator_id=current_user.id,
        status=CaseStatus.PENDING
    )
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@router.get("/cases/", response_model=List[CaseResponse])
async def get_cases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[CaseStatus] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Case)
    if status:
        query = query.filter(Case.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/cases/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.put("/cases/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: int,
    case: CaseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    for key, value in case.dict(exclude_unset=True).items():
        setattr(db_case, key, value)
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.post("/cases/{case_id}/reviews", response_model=ReviewResponse)
async def create_review(
    case_id: int,
    review: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db_review = Review(
        case_id=case_id,
        reviewer_id=current_user.id,
        findings=review.findings,
        recommendations=review.recommendations,
        diagnosis=review.diagnosis,
        confidence_level=review.confidence_level,
        status=ReviewStatus.DRAFT
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.post("/cases/{case_id}/upload-report")
async def upload_report(
    case_id: int,
    report: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    report_path = await storage_service.save_report(report, str(case_id))
    case.report_path = report_path
    db.commit()
    
    return {"message": "Report uploaded successfully", "path": report_path}

@router.post("/cases/{case_id}/upload-heatmap")
async def upload_heatmap(
    case_id: int,
    heatmap: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    heatmap_path = await storage_service.save_heatmap(heatmap, str(case_id))
    case.heatmap_path = heatmap_path
    db.commit()
    
    return {"message": "Heatmap uploaded successfully", "path": heatmap_path}

@router.get("/{case_id}/reviews", response_model=List[ReviewResponse])
def get_case_reviews(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case.reviews

@router.get("/stats/", response_model=dict)
def get_case_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    total_cases = db.query(Case).count()
    pending_cases = db.query(Case).filter(Case.status == CaseStatus.PENDING).count()
    reviewed_cases = db.query(Case).filter(Case.status == CaseStatus.REVIEWED).count()
    accepted_cases = db.query(Case).filter(Case.status == CaseStatus.ACCEPTED).count()
    rejected_cases = db.query(Case).filter(Case.status == CaseStatus.REJECTED).count()
    
    return {
        "total_cases": total_cases,
        "pending_cases": pending_cases,
        "reviewed_cases": reviewed_cases,
        "accepted_cases": accepted_cases,
        "rejected_cases": rejected_cases
    } 