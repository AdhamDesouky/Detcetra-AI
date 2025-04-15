import os
import shutil
from datetime import datetime
from fastapi import UploadFile, HTTPException
from pathlib import Path
from typing import Optional

class StorageService:
    def __init__(self):
        self.base_dir = Path("static/uploads")
        self.image_dir = self.base_dir / "images"
        self.report_dir = self.base_dir / "reports"
        self.heatmap_dir = self.base_dir / "heatmaps"
        
        # Create directories if they don't exist
        self.image_dir.mkdir(parents=True, exist_ok=True)
        self.report_dir.mkdir(parents=True, exist_ok=True)
        self.heatmap_dir.mkdir(parents=True, exist_ok=True)

    async def save_image(self, file: UploadFile, case_id: str) -> str:
        """Save an uploaded image and return its path"""
        try:
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{case_id}_{timestamp}{Path(file.filename).suffix}"
            file_path = self.image_dir / filename

            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            return str(file_path.relative_to(self.base_dir))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

    async def save_report(self, file: UploadFile, case_id: str) -> str:
        """Save a report file and return its path"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{case_id}_{timestamp}{Path(file.filename).suffix}"
            file_path = self.report_dir / filename

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            return str(file_path.relative_to(self.base_dir))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving report: {str(e)}")

    async def save_heatmap(self, file: UploadFile, case_id: str) -> str:
        """Save a heatmap image and return its path"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{case_id}_{timestamp}{Path(file.filename).suffix}"
            file_path = self.heatmap_dir / filename

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            return str(file_path.relative_to(self.base_dir))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving heatmap: {str(e)}")

    def get_file_path(self, relative_path: str) -> Optional[Path]:
        """Get the full path of a file from its relative path"""
        try:
            file_path = self.base_dir / relative_path
            if file_path.exists():
                return file_path
            return None
        except Exception:
            return None

    def delete_file(self, relative_path: str) -> bool:
        """Delete a file given its relative path"""
        try:
            file_path = self.base_dir / relative_path
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False 