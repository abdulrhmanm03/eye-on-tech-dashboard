from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from models.user import User

class ReportBase(BaseModel):
    content: str
    task_id: Optional[int] = None

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    created_by: int
    ticket_id: int
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
