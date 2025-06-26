from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.asset import AssetCreate, AssetRead, GrantAccessRequest
from crud import asset as crud_asset
from crud import ticket as crud_ticket
from db import get_db
from auth.utils import get_current_user
from models.user import User
from enums.user_role import UserRole
from schemas.component import ComponentRead
from crud import component as component_crud
from schemas.ticket import TicketRead
from schemas.user import UserRead

router = APIRouter(prefix="/assets", tags=["assets"])

@router.get("/{asset_id}", response_model=AssetRead)
def get_asset_by_id(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    asset = crud_asset.get_asset(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.post("/create", response_model=AssetRead)
def create_asset(
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
    print(asset_in)
    asset = crud_asset.create_asset(db, asset_in)
    return asset

@router.get("/", response_model=List[AssetRead])
def list_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role in [UserRole.supervisor, UserRole.administrator]:
        return crud_asset.get_assets(db, skip=skip, limit=limit)
    user_id = current_user.get("id")
    return crud_asset.get_accessable_assets(db, user_id)

@router.get("/tickets/{asset_id}", response_model=List[TicketRead])
def get_asset_tickets(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_ticket.get_asset_tickets(db, asset_id)

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
    user_role = current_user.get("role")

    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden",
        )
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

@router.post("/{asset_id}/grant-access", status_code=204)
def grant_asset_access(
    asset_id: int,
    grant_asset_request: GrantAccessRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    success = crud_asset.grant_asset_access(db, asset_id, grant_asset_request.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Asset not found or no valid users")

@router.delete("/{asset_id}/revoke-access", status_code=204)
def revoke_asset_access(
    asset_id: int,
    revoke_request: GrantAccessRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    success = crud_asset.revoke_asset_access(db, asset_id, revoke_request.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Asset or user access not found")

@router.get("/users/{asset_id}/", response_model=List[UserRead])
def get_asset_access_users(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = crud_asset.get_asset(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return crud_asset.get_asset_access_users(db, asset_id)

