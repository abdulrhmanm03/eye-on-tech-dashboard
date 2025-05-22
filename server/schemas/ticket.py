from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enums.ticket_status import TicketStatus

# Shared fields
class TicketBase(BaseModel):
    object_type: str
    object_id: int
    description: str
    creation_date: date
    status: TicketStatus

# For creating a ticket
class TicketCreate(TicketBase):
    handler_ids: Optional[List[int]]  # IDs of technicians assigned to the ticket

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
    handlers: List[UserBasic]

    class Config:
        from_attributes = True
