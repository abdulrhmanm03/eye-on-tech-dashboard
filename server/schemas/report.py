from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    ticket_id: int
    content: str

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    content: Optional[str] = None

class ReportRead(ReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
