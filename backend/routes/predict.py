from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from ..database import get_db
from ..models.models import Case
from ..auth import get_current_user
from ...ai_model.inference import InferenceEngine

router = APIRouter()

# Initialize inference engine
engine = InferenceEngine()

@router.post("/{case_id}")
async def predict_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # Get case
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
        
        if not case.image_path:
            raise HTTPException(status_code=400, detail="No image found for this case")
        
        # Make prediction
        result = engine.predict(case.image_path)
        if not result:
            raise HTTPException(status_code=500, detail="Error making prediction")
        
        # Update case with prediction
        case.ai_prediction = result["label"]
        case.ai_confidence = result["confidence"]
        case.ai_heatmap_path = result["heatmap"]
        db.commit()
        
        return {
            "case_id": case.id,
            "prediction": result["label"],
            "confidence": result["confidence"],
            "heatmap_path": result["heatmap"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error making prediction: {str(e)}")

@router.get("/{case_id}")
async def get_prediction(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if not case.ai_prediction:
        raise HTTPException(status_code=404, detail="No prediction found for this case")
    
    return {
        "case_id": case.id,
        "prediction": case.ai_prediction,
        "confidence": case.ai_confidence,
        "heatmap_path": case.ai_heatmap_path
    } 