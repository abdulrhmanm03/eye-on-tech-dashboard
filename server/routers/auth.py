from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import user as schemas
from db import get_db
from auth.auth import login

router = APIRouter(prefix="/auth", tags=["users"])

@router.post("/login", response_model=str)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return login(db, username=user.username, password=user.password)

