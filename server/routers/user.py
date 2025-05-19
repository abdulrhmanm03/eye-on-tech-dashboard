from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, Path, status 
from sqlalchemy.orm import Session
from schemas import user as schemas
from crud import user as crud
from db import get_db
from auth.utils import get_current_user
from enums.user_role import UserRole
from models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), payload: dict = Depends(get_current_user)):
    user_role = payload.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
    return crud.create_user(db, user)

@router.delete("/{user_id}", response_model=schemas.UserRead)
def delete_user(
    user_id: int = Path(...),
    db: Session = Depends(get_db),
    payload: Dict = Depends(get_current_user)
):
    user_role = payload.get("role")

    if user_role != UserRole.supervisor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only supervisors can delete users",
        )

    deleted_user = crud.delete_user(db, user_id)
    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return deleted_user


@router.put("/", response_model=schemas.UserRead)
def update_user(
    user: schemas.UserRead,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user)
):
    user_role = payload.get("role")

    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update users",
        )

    updated_user = crud.update_user(db, user_data=user)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return updated_user

@router.get("/", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@router.post("/reset_password/{id}", response_model=schemas.UserRead)
def reset_password(id: int, db: Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    user_role = current_user.get("role")

    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        user_id = current_user.get("id")
        if user_id != id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update users",
            )
    user = crud.reset_user_password(db, id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user
        


