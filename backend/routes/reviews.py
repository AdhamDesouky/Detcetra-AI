from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import Review, Case
from ..schemas import ReviewCreate, ReviewUpdate, Review as ReviewSchema
from ..auth import get_current_user

router = APIRouter(
    prefix="/api/reviews",
    tags=["reviews"]
)

@router.post("/", response_model=ReviewSchema)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if case exists
    case = db.query(Case).filter(Case.id == review.case_id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found"
        )
    
    # Check if review already exists for this case
    existing_review = db.query(Review).filter(Review.case_id == review.case_id).first()
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this case"
        )
    
    # Create new review
    db_review = Review(
        reviewer_id=current_user.id,
        case_id=review.case_id,
        findings=review.findings,
        conclusion=review.conclusion,
        status=review.status,
        created_at=datetime.utcnow()
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update case status
    case.status = review.status
    db.commit()
    
    return db_review

@router.put("/{review_id}", response_model=ReviewSchema)
def update_review(
    review_id: int,
    review: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if user is the reviewer
    if db_review.reviewer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this review"
        )
    
    # Update review
    for field, value in review.dict(exclude_unset=True).items():
        setattr(db_review, field, value)
    
    # Update case status if review status changed
    if review.status:
        case = db.query(Case).filter(Case.id == db_review.case_id).first()
        if case:
            case.status = review.status
    
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/case/{case_id}", response_model=ReviewSchema)
def get_review_by_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    review = db.query(Review).filter(Review.case_id == case_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return review

@router.get("/", response_model=List[ReviewSchema])
def get_reviews(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Review)
    
    if status:
        query = query.filter(Review.status == status)
    
    return query.offset(skip).limit(limit).all() 