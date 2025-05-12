from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from auth.auth import authenticate_user
from schemas.user import UserBase, UserCreate
from auth.jwt_utils import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=str)
def login(user: UserBase, db: Session = Depends(get_db)):
    authenticated_user = authenticate_user(db, username=user.username, password=user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"username": authenticated_user.username}
    )
    
    return access_token

