from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    content: str

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    ticket_id: int
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
