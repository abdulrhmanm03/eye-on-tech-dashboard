from operator import or_
from sqlalchemy.orm import Session
from models.asset import Asset
from schemas.asset import AssetCreate
from schemas.ticket import TicketRead
from models.user import User

def create_asset(db: Session, asset_in: AssetCreate) -> Asset:
    asset = Asset(**asset_in.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset

def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Asset).offset(skip).limit(limit).all()

def get_asset(db: Session, asset_id: int):
    return db.query(Asset).filter(Asset.id == asset_id).first()

def update_asset(db: Session, asset_id: int, asset_in: AssetCreate):
    asset = get_asset(db, asset_id)
    if not asset:
        return None
    for field, value in asset_in.dict().items():
        setattr(asset, field, value)
    db.commit()
    db.refresh(asset)
    return asset

def delete_asset(db: Session, asset_id: int) -> bool:
    asset = get_asset(db, asset_id)
    if not asset:
        return False
    db.delete(asset)
    db.commit()
    return True

def grant_asset_access(db: Session, asset_id: int, user_id: int) -> bool:
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        return False

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    if user not in asset.users_with_access:
        asset.users_with_access.append(user)

    db.commit()
    return True

def get_asset_access_users(db: Session, asset_id: int):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        return []
    return asset.users_with_access

def get_accessable_assets(db: Session, user_id: int):
    return (
        db.query(Asset)
        .filter(
            or_(
                Asset.owner_id == user_id,
                Asset.users_with_access.any(User.id == user_id)
            )
        )
        .all()
    )

def revoke_asset_access(db: Session, asset_id: int, user_id: int) -> bool:
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        return False

    user = db.query(User).filter(User.id == user_id).first()
    if not user or user not in asset.users_with_access:
        return False

    asset.users_with_access.remove(user)
    db.commit()
    return True
