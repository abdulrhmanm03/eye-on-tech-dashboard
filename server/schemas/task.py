from typing import Optional
from pydantic import BaseModel
from datetime import date
from enums.task_status import TaskStatus

# Shared fields
class TaskBase(BaseModel):
    description: Optional[str]
    creation_date: date
    status: TaskStatus

# For creating a task
class TaskCreate(TaskBase):
    ticket_id: int

# For reading a task
class TaskRead(TaskBase):
    id: int
    ticket_id: int

    class Config:
        from_attributes = True
