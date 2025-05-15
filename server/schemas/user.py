from pydantic import BaseModel
from enums.user_role import UserRole

# Base schema shared by create/read
class UserBase(BaseModel):
    username: str
    password: str

# Schema for creating a user (includes password)
class UserCreate(UserBase):
    role: UserRole

# Schema for reading user info (excluding password)
class UserRead(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True
