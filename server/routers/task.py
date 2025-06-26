from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.task import TaskBase, TaskCreate, TaskRead
from crud import task as crud_task
from crud import ticket as crud_ticket
from db import get_db
from auth.utils import get_current_user
from models.user import User
from enums.user_role import UserRole

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/create", response_model=TaskCreate)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = crud_task.create_task(db, task_in)
    return task

@router.get("/", response_model=List[TaskRead])
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_task.get_tasks(db)

@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_role = current_user.get("role")
    user_id = current_user.get("id")

    # Fetch the task to get ticket_id
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # If technician, verify ownership
    if user_role == UserRole.technician:
        ticket_id = getattr(task, "ticket_id")
        ticket = crud_ticket.get_ticket(db, ticket_id)
        if not ticket or ticket.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You do not own the ticket for this task."
            )

    # Block all other non-privileged roles
    elif user_role not in [UserRole.supervisor, UserRole.administrator, UserRole.engineer]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )

    # Proceed with update
    updated = crud_task.update_task(db, task_id, task_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/delete/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_role = current_user.get("role")
    if user_role != UserRole.supervisor:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = crud_task.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

