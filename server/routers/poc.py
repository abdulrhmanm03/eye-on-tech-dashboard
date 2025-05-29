from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from auth.utils import get_current_user
from schemas import poc as schemas
from crud import poc as crud
from models.user import User

router = APIRouter(prefix="/pocs", tags=["points_of_contact"])

@router.post("/create/", response_model=schemas.PointOfContactRead)
def create_point_of_contact(
    poc: schemas.PointOfContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_poc(db, poc)

@router.get("/user/{user_id}", response_model=List[schemas.PointOfContactRead])
def get_user_pocs(
        user_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return crud.get_pocs_by_user(db, user_id)

@router.get("/{poc_id}", response_model=schemas.PointOfContactRead)
def get_point_of_contact(
        poc_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    poc = crud.get_poc(db, poc_id)
    if not poc:
        raise HTTPException(status_code=404, detail="Point of contact not found")
    return poc

@router.put("/{poc_id}", response_model=schemas.PointOfContactRead)
def update_point_of_contact(
    poc_id: int,
    poc_data: schemas.PointOfContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_poc = crud.update_poc(db, poc_id, poc_data)
    if not updated_poc:
        raise HTTPException(status_code=404, detail="Point of contact not found")
    return updated_poc

@router.delete("/{poc_id}", response_model=schemas.PointOfContactRead)
def delete_point_of_contact(
    poc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted_poc = crud.delete_poc(db, poc_id)
    if not deleted_poc:
        raise HTTPException(status_code=404, detail="Point of contact not found")
    return deleted_poc
