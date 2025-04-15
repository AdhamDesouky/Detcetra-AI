import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database.database import Base, get_db
from models.models import User, Case, Review
from auth.auth import get_password_hash

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Test client
client = TestClient(app)

# Test data
test_user_data = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123",
    "role": "radiologist"
}

test_case_data = {
    "patient_id": "P001",
    "patient_name": "John Doe",
    "patient_age": 45,
    "patient_gender": "Male",
    "case_number": "CASE001",
    "notes": "Test case"
}

test_review_data = {
    "findings": "Test findings",
    "recommendations": "Test recommendations",
    "diagnosis": "Test diagnosis",
    "confidence_level": "High"
}

@pytest.fixture(scope="module")
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create test user
    db = TestingSessionLocal()
    hashed_password = get_password_hash(test_user_data["password"])
    test_user = User(
        username=test_user_data["username"],
        email=test_user_data["email"],
        hashed_password=hashed_password,
        role=test_user_data["role"]
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    yield test_user
    
    # Cleanup
    Base.metadata.drop_all(bind=engine)

def test_login(setup_database):
    response = client.post(
        "/auth/token",
        data={
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    return response.json()["access_token"]

def test_create_case(setup_database):
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a test image file
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image data")
    
    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/api/cases/",
            headers=headers,
            data=test_case_data,
            files={"image": ("test_image.jpg", f, "image/jpeg")}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["patient_id"] == test_case_data["patient_id"]
    assert data["patient_name"] == test_case_data["patient_name"]
    assert "image_path" in data
    return data["id"]

def test_get_cases(setup_database):
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/cases/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_case(setup_database):
    case_id = test_create_case(setup_database)
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get(f"/api/cases/{case_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == case_id

def test_create_review(setup_database):
    case_id = test_create_case(setup_database)
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        f"/api/cases/{case_id}/reviews",
        headers=headers,
        json=test_review_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == case_id
    assert data["findings"] == test_review_data["findings"]

def test_upload_report(setup_database):
    case_id = test_create_case(setup_database)
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a test report file
    with open("test_report.pdf", "wb") as f:
        f.write(b"fake report data")
    
    with open("test_report.pdf", "rb") as f:
        response = client.post(
            f"/api/cases/{case_id}/upload-report",
            headers=headers,
            files={"report": ("test_report.pdf", f, "application/pdf")}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "path" in data

def test_upload_heatmap(setup_database):
    case_id = test_create_case(setup_database)
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a test heatmap file
    with open("test_heatmap.png", "wb") as f:
        f.write(b"fake heatmap data")
    
    with open("test_heatmap.png", "rb") as f:
        response = client.post(
            f"/api/cases/{case_id}/upload-heatmap",
            headers=headers,
            files={"heatmap": ("test_heatmap.png", f, "image/png")}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "path" in data

def test_update_case(setup_database):
    case_id = test_create_case(setup_database)
    token = test_login(setup_database)
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "patient_name": "Updated Name",
        "notes": "Updated notes"
    }
    
    response = client.put(
        f"/api/cases/{case_id}",
        headers=headers,
        json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["patient_name"] == update_data["patient_name"]
    assert data["notes"] == update_data["notes"] 