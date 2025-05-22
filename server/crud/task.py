from sqlalchemy.orm import Session
from models.task import Task
from schemas.task import TaskCreate

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
    for key, value in task_in.dict().items():
        setattr(task, key, value)
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

