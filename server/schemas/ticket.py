from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enums.ticket_status import TicketStatus

# Shared fields
class TicketBase(BaseModel):
    description: Optional[str]
    creation_date: date
    status: TicketStatus

class TicketCreate(TicketBase):
    asset_id: int

# Minimal user schema for handlers
class UserBasic(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# For reading a ticket
class TicketRead(TicketBase):
    id: int
    owner_id: int
    asset_id: int
    handlers: List[UserBasic]

    class Config:
        from_attributes = True
