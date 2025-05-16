from pydantic import BaseModel

# Shared fields
class PointOfContactBase(BaseModel):
    organization: str
    full_name: str
    phone_number: str
    email: str

# For creating a contact
class PointOfContactCreate(PointOfContactBase):
    user_id: int

# For reading a contact
class PointOfContactRead(PointOfContactBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

