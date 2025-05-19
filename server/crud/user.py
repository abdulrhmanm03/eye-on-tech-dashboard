from sqlalchemy.orm import Session
from models import user as models
from schemas import user as schemas
from auth.utils import hash_password
from config import DEFAULT_PASSWORD

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    user_data = user.model_dump()
    user_data["password"] = hashed_password
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user

def update_user(db: Session, user_data: schemas.UserRead):
    user = db.query(models.User).filter(models.User.id == user_data.id).first() 
    if not user:
        return None

    user.username = user_data.username
    user.role = user_data.role
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(models.User).all()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()
def reset_user_password(db: Session, user_id: int): 
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        return None

    hashed_password = hash_password(DEFAULT_PASSWORD)
    user.password = hashed_password
    db.commit()
    db.refresh(user)

    return user
