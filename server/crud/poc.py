from sqlalchemy.orm import Session
from models import poc as models
from schemas import poc as schemas

def create_poc_for_user(db: Session, poc: schemas.PointOfContactCreate):
    db_poc = models.PointOfContact(
        username=poc.username,
        type=poc.type,
        value= poc.value,
        user_id=poc.user_id
    )
    db.add(db_poc)
    db.commit()
    db.refresh(db_poc)
    return db_poc

def create_poc_for_asset(db: Session, poc: schemas.PointOfContactCreate):
    db_poc = models.PointOfContact(
        username=poc.username,
        type=poc.type,
        value= poc.value,
        asset_id=poc.asset_id
    )
    db.add(db_poc)
    db.commit()
    db.refresh(db_poc)
    return db_poc

def get_user_pocs(db: Session, user_id: int):
    return db.query(models.PointOfContact).filter(models.PointOfContact.user_id == user_id).all()

def get_asset_pocs(db: Session, asset_id: int):
    return db.query(models.PointOfContact).filter(models.PointOfContact.asset_id == asset_id).all()

def get_poc(db: Session, poc_id: int):
    return db.query(models.PointOfContact).filter(models.PointOfContact.id == poc_id).first()

def update_poc(db: Session, poc_id: int, poc_data: schemas.PointOfContactCreate):
    db_poc = get_poc(db, poc_id)
    if not db_poc:
        return None
    for key, value in poc_data.dict(exclude_unset=True).items():
        setattr(db_poc, key, value)
    db.commit()
    db.refresh(db_poc)
    return db_poc

def delete_poc(db: Session, poc_id: int):
    db_poc = get_poc(db, poc_id)
    if not db_poc:
        return None
    db.delete(db_poc)
    db.commit()
    return db_poc
