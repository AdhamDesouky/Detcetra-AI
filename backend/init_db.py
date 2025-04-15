from sqlalchemy.orm import Session
from database.database import engine, SessionLocal
from models.models import Base, User, UserRole
from auth.auth import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin user exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully")
    else:
        print("Admin user already exists")
    
    db.close()

if __name__ == "__main__":
    init_db() 