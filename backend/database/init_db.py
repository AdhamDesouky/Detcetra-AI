from sqlalchemy.orm import Session
from database.database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Create initial admin user if not exists
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()
    
    # Create initial radiologist user if not exists
    radiologist = db.query(User).filter(User.email == "radiologist@example.com").first()
    if not radiologist:
        radiologist = User(
            username="radiologist",
            email="radiologist@example.com",
            hashed_password=get_password_hash("radiologist123"),
            role="radiologist",
            is_active=True
        )
        db.add(radiologist)
        db.commit()
    
    db.close()

if __name__ == "__main__":
    init_db() 