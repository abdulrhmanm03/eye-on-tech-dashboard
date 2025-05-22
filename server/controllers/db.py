from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from enums.user_role import UserRole
from models.user import User

async def backup_db_controller(
    current_user: User 
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action",
        )

    db_path = Path("app.db")
    if not db_path.exists():
        raise HTTPException(status_code=404, detail="Database file not found.")
    return FileResponse(path=db_path, filename="app.db", media_type="application/octet-stream")

async def restore_db_controller(current_user: User, uploeded_db: UploadFile):
    user_role = current_user.get("role")
    if user_role != UserRole.supervisor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action",
        )
    if uploeded_db.content_type != "application/octet-stream":
        raise HTTPException(status_code=400, detail="Invalid file type. Expected a SQLite file.")
        
    db_path = Path("app.db")

    with open(db_path, "wb") as f:
        f.write(uploeded_db.file.read())

