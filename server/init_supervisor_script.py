from sqlalchemy.orm import Session
from db import SessionLocal
from models.user import User
from enums.user_role import UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed_password = pwd_context.hash("1234")
print(hashed_password)

db: Session = SessionLocal()

supervisor = User(
    username="Supervisor",
    password=hashed_password,
    role=UserRole.supervisor
)

db.add(supervisor)
db.commit()
db.refresh(supervisor)
print(f"Supervisor created: {supervisor.username}")
