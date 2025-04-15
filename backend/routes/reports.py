from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime
from pdf2image import convert_from_path

from ..database import get_db
from ..models.models import Case
from ..auth import get_current_user

router = APIRouter()

@router.post("/upload/{case_id}")
async def upload_report(
    case_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # Check if case exists
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
        
        # Save PDF file
        file_path = f"static/uploads/reports/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert PDF to images
        images = convert_from_path(file_path)
        image_paths = []
        
        for i, image in enumerate(images):
            image_path = f"static/uploads/reports/{os.path.splitext(os.path.basename(file_path))[0]}_page_{i+1}.jpg"
            image.save(image_path, "JPEG")
            image_paths.append(image_path)
        
        # Update case with report path
        case.report_path = file_path
        case.report_images = image_paths
        db.commit()
        
        return {
            "message": "Report uploaded successfully",
            "case_id": case.id,
            "report_path": file_path,
            "image_paths": image_paths
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing report: {str(e)}")

@router.get("/{case_id}")
async def get_report(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if not case.report_path:
        raise HTTPException(status_code=404, detail="No report found for this case")
    
    return {
        "case_id": case.id,
        "report_path": case.report_path,
        "image_paths": case.report_images
    } 