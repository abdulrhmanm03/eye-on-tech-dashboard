from pydantic import BaseModel
from enums import UserRole

class UserBase(BaseModel):
    username: str
    password: str

class UserCreate(UserBase):
    role: UserRole

class UserRead(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True
