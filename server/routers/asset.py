from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.asset import AssetCreate, AssetRead
from crud import asset as crud_asset
from db import get_db
from auth.utils import get_current_user
from models.user import User
from enums.user_role import UserRole
from schemas.component import ComponentRead
from crud import component as component_crud

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/create", response_model=AssetRead)
def create_asset(
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = crud_asset.create_asset(db, asset_in)
    return asset

@router.get("/", response_model=List[AssetRead])
def list_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_asset.get_assets(db, skip=skip, limit=limit)

@router.get("/components/{asset_id}", response_model=List[ComponentRead])
def get_ticket_tasks(asset_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return component_crud.get_asset_components(db, asset_id, skip, limit)

@router.get("/{asset_id}", response_model=AssetRead)
def read_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = crud_asset.get_asset(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.put("/{asset_id}", response_model=AssetRead)
def update_asset(
    asset_id: int,
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = crud_asset.update_asset(db, asset_id, asset_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Asset not found")
    return updated

@router.delete("/delete/{asset_id}", status_code=204)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role != UserRole.supervisor:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = crud_asset.delete_asset(db, asset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Asset not found")

