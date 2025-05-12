from sqlalchemy.orm import Session
from models import user as models
from schemas import user as schemas
from auth.utils import hash_password

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    user_data = user.model_dump()
    user_data["password"] = hashed_password
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(models.User).all()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()
