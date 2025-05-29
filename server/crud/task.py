from datetime import date
from sqlalchemy.orm import Session
from models.task import Task
from models.ticket import Ticket
from models.asset import Asset
from schemas.task import TaskCreate
from enums.task_status import TaskStatus

def create_task(db: Session, task_in: TaskCreate) -> Task:
    task = Task(**task_in.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_task(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[Task]:
    return db.query(Task).offset(skip).limit(limit).all()

def get_ticket_tasks(db: Session, ticket_id: int, skip: int = 0, limit: int = 100) -> list[Task]:
    return (
        db.query(Task)
        .filter(Task.ticket_id == ticket_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_task(db: Session, task_id: int, task_in: TaskCreate) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    
    original_status = getattr(task,'status')
    
    for key, value in task_in.dict().items():
        setattr(task, key, value)
    
    new_status = task_in.dict().get('status')
    if original_status == TaskStatus.in_progress and new_status == TaskStatus.completed:
        if getattr(task, 'ticket_id'):
            ticket = db.query(Ticket).filter(Ticket.id == task.ticket_id).first()
            if ticket and getattr(ticket, 'asset_id'):
                asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
                if asset:
                    today = date.today()
                    setattr(asset, 'last_service', today)
    
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: int) -> bool:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True

