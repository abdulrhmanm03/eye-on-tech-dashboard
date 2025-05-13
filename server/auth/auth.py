from crud.user import get_user_by_username 
from sqlalchemy.orm import Session
from auth.utils import verify_password

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user
