from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.component import ComponentCreate, ComponentRead
from crud import component as crud_component
from db import get_db
from auth.utils import get_current_user
from models.user import User

router = APIRouter(prefix="/components", tags=["components"])

@router.post("/create", response_model=ComponentRead)
def create_component(component_in: ComponentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    component = crud_component.create_component(db, component_in)
    return component

@router.get("/", response_model=List[ComponentRead])
def list_components(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_component.get_components(db, skip, limit)

@router.get("/{component_id}", response_model=ComponentRead)
def read_component(component_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    component = crud_component.get_component(db, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component

@router.put("/{component_id}", response_model=ComponentRead)
def update_component(component_id: int, component_in: ComponentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated = crud_component.update_component(db, component_id, component_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Component not found")
    return updated

@router.delete("/delete/{component_id}", status_code=204)
def delete_component(component_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = crud_component.delete_component(db, component_id)
    if not success:
        raise HTTPException(status_code=404, detail="Component not found")
