from pydantic import BaseModel
from enums.user_role import UserRole
import config

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class UserBase(BaseModel):
    username: str

class UserInDB(UserBase):
    password: str = config.DEFAULT_PASSWORD

class UserCreate(UserBase):
    role: UserRole

class UserRead(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True
