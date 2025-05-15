from sqlalchemy.orm import Session
from models.asset import Asset
from schemas.asset import AssetCreate

def create_asset(db: Session, asset_in: AssetCreate) -> Asset:
    asset = Asset(**asset_in.dict())
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
