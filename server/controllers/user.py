from typing import Dict 
from fastapi import Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from schemas import user as schemas
from crud import user as crud
from db import get_db
from auth.utils import get_current_user
from enums.user_role import UserRole
from models.user import User

def create_user_controller(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action",
        )
    return crud.create_user(db, user)


def delete_user_controller(
    user_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: Dict = Depends(get_current_user)
):
    user_role = current_user.get("role")

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


def update_user_controller(
    user: schemas.UserRead,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_role = current_user.get("role")

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


def list_users_controller(
    db: Session = Depends(get_db)
):
    return crud.get_users(db)

def get_user_by_id_controller(user_id: int, db: Session, current_user: dict):
    return crud.get_users_by_id(db, user_id)

def reset_password_controller(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

def change_password_controller(
    payload: schemas.ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    try:
        user = crud.change_user_password(db, user_id, payload.old_password, payload.new_password)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return user
