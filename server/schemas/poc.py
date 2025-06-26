from typing import Optional
from pydantic import BaseModel

from enums.poc_types import ContactType

class PointOfContactBase(BaseModel):
    type: ContactType  
    value: str
    username: Optional[str] = None

class PointOfContactCreate(PointOfContactBase):
    user_id: Optional[int] = None
    asset_id: Optional[int] = None

# For reading a contact
class PointOfContactRead(PointOfContactBase):
    id: int
    user_id: Optional[int] = None
    asset_id: Optional[int] = None

    class Config:
        from_attributes = True

