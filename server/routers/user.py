from typing import Dict
from fastapi import APIRouter, Depends, Path  
from sqlalchemy.orm import Session
from schemas import user as schemas
from db import get_db
from auth.utils import get_current_user
from models.user import User
from controllers import user as controller

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model= schemas.UserRead)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return controller.get_user_by_id_controller(user_id, db, current_user)

@router.post("/", response_model=schemas.UserRead)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return controller.create_user_controller(user, db, current_user)

@router.delete("/{user_id}", response_model=schemas.UserRead)
def delete_user(
    user_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: Dict = Depends(get_current_user)
):
    return controller.delete_user_controller(user_id, db, current_user)


@router.put("/", response_model=schemas.UserRead)
def update_user(
    user: schemas.UserRead,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return controller.update_user_controller(user, db, current_user)

@router.get("/", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
    return controller.list_users_controller(db)

@router.post("/reset_password/{id}", response_model=schemas.UserRead)
def reset_password(id: int, db: Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return controller.reset_password_controller(id, db, current_user)

@router.post("/change_password/", response_model=schemas.UserRead)
def change_password(
        payload: schemas.ChangePassword,
        db: Session = Depends(get_db),
        current_user : User = Depends(get_current_user)
):
    return controller.change_password_controller(payload, db, current_user)
