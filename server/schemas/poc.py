from pydantic import BaseModel

from enums.poc_types import ContactType

class PointOfContactBase(BaseModel):
    type: ContactType  
    value: str

class PointOfContactCreate(PointOfContactBase):
    user_id: int

# For reading a contact
class PointOfContactRead(PointOfContactBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

