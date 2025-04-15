from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pydicom
import os
import shutil
from datetime import datetime

from ..database import get_db
from ..models.models import Case, CaseStatus
from ..schemas.case import CaseCreate, CaseResponse
from ..auth import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_dicom(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # Save DICOM file
        file_path = f"static/uploads/dicom/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read DICOM metadata
        ds = pydicom.dcmread(file_path)
        
        # Extract relevant metadata
        patient_id = ds.PatientID if hasattr(ds, 'PatientID') else None
        accession_number = ds.AccessionNumber if hasattr(ds, 'AccessionNumber') else None
        modality = ds.Modality if hasattr(ds, 'Modality') else None
        laterality = ds.ImageLaterality if hasattr(ds, 'ImageLaterality') else None
        patient_age = ds.PatientAge if hasattr(ds, 'PatientAge') else None
        
        # Create case record
        case = Case(
            patient_id=patient_id,
            accession_number=accession_number,
            modality=modality,
            view=laterality,
            image_path=file_path,
            metadata={
                "patient_age": patient_age,
                "study_date": str(ds.StudyDate) if hasattr(ds, 'StudyDate') else None,
                "study_time": str(ds.StudyTime) if hasattr(ds, 'StudyTime') else None,
                "study_description": str(ds.StudyDescription) if hasattr(ds, 'StudyDescription') else None,
                "series_description": str(ds.SeriesDescription) if hasattr(ds, 'SeriesDescription') else None,
            }
        )
        
        db.add(case)
        db.commit()
        db.refresh(case)
        
        return {
            "message": "DICOM file uploaded successfully",
            "case_id": case.id,
            "metadata": {
                "patient_id": patient_id,
                "accession_number": accession_number,
                "modality": modality,
                "laterality": laterality,
                "patient_age": patient_age
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing DICOM file: {str(e)}")

@router.get("/metadata/{case_id}")
async def get_dicom_metadata(
    case_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    try:
        ds = pydicom.dcmread(case.image_path)
        return {
            "patient_id": ds.PatientID if hasattr(ds, 'PatientID') else None,
            "accession_number": ds.AccessionNumber if hasattr(ds, 'AccessionNumber') else None,
            "modality": ds.Modality if hasattr(ds, 'Modality') else None,
            "laterality": ds.ImageLaterality if hasattr(ds, 'ImageLaterality') else None,
            "patient_age": ds.PatientAge if hasattr(ds, 'PatientAge') else None,
            "study_date": str(ds.StudyDate) if hasattr(ds, 'StudyDate') else None,
            "study_time": str(ds.StudyTime) if hasattr(ds, 'StudyTime') else None,
            "study_description": str(ds.StudyDescription) if hasattr(ds, 'StudyDescription') else None,
            "series_description": str(ds.SeriesDescription) if hasattr(ds, 'SeriesDescription') else None,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DICOM metadata: {str(e)}") 