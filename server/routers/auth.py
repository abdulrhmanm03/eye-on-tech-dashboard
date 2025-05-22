from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from auth.auth import authenticate_user
from schemas.user import  UserInDB 
from auth.jwt_utils import create_access_token
from schemas.token import Token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(user: UserInDB, db: Session = Depends(get_db)):
    authenticated_user = authenticate_user(db, username=user.username, password=user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    access_token = create_access_token(
        data={"username": authenticated_user.username, "role": authenticated_user.role, "id": authenticated_user.id}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": authenticated_user.username,
        "id": authenticated_user.id,
        "role": authenticated_user.role,
    }
