from pydantic import BaseModel
from enums import UserRole

class UserBase(BaseModel):
    username: str
    password: str
    role: UserRole

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True
