from auth.jwt_utils import create_access_token
from crud.user import get_user_by_username 
from sqlalchemy.orm import Session
from auth.utils import verify_password

def login(db: Session ,username: str, password: str):
    user = get_user_by_username(db, username)
    if user: 
        if True:
            token = create_access_token(**user)
            return token
    return False
