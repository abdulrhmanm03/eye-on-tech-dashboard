from sqlalchemy.orm import Session
from models.component import Component
from schemas.component import ComponentCreate
from models.component import Component

def create_component(db: Session, component_in: ComponentCreate) -> Component:
    component = Component(**component_in.dict())
    db.add(component)
    db.commit()
    db.refresh(component)
    return component

def get_components(db: Session, skip: int = 0, limit: int = 100) -> list[Component]:
    return db.query(Component).offset(skip).limit(limit).all()

def get_component(db: Session, component_id: int) -> Component | None:
    return db.query(Component).filter(Component.id == component_id).first()

def get_asset_components(db: Session, asset_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Component)
        .filter(Component.parent_asset_id == asset_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_component(db: Session, component_id: int, component_in: ComponentCreate) -> Component | None:
    component = db.query(Component).filter(Component.id == component_id).first()
    if not component:
        return None
    for field, value in component_in.dict().items():
        setattr(component, field, value)
    db.commit()
    db.refresh(component)
    return component

def delete_component(db: Session, component_id: int) -> bool:
    component = db.query(Component).filter(Component.id == component_id).first()
    if not component:
        return False
    db.delete(component)
    db.commit()
    return True
