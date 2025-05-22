from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse 
from controllers import db as controllers
from auth.utils import get_current_user
from models.user import User

router = APIRouter(prefix="/db", tags=["db"])

@router.get("/backup", response_class=FileResponse)
async def backup_db(current_user: User = Depends(get_current_user)):
    return await controllers.backup_db_controller(current_user)

@router.post("/restore")
async def restore_db(
    uploaded_db: UploadFile,
    current_user: User = Depends(get_current_user)
):
    return await controllers.restore_db_controller(current_user, uploaded_db)
