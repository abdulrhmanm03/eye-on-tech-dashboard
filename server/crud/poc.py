from sqlalchemy.orm import Session
from models import poc as models
from schemas import poc as schemas

def create_poc(db: Session, poc: schemas.PointOfContactCreate, user_id: int):
    # Avoid passing user_id twice
    db_poc = models.PointOfContact(
        organization=poc.organization,
        full_name=poc.full_name,
        phone_number=poc.phone_number,
        email=poc.email,
        user_id=user_id  # use the user_id argument only
    )
    db.add(db_poc)
    db.commit()
    db.refresh(db_poc)
    return db_poc

def get_pocs_by_user(db: Session, user_id: int):
    return db.query(models.PointOfContact).filter(models.PointOfContact.user_id == user_id).all()

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
