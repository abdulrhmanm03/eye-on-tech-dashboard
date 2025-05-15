from pydantic import BaseModel
from datetime import date
from enums.task_status import TaskStatus

# Shared fields
class TaskBase(BaseModel):
    object_type: str
    object_id: int
    description: str
    creation_date: date
    status: TaskStatus

# For creating a task
class TaskCreate(TaskBase):
    owner_id: int

# For reading a task
class TaskRead(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
