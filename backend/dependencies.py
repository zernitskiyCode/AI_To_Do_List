# # backend/dependencies.py
# from fastapi import Request, HTTPException, Depends
# from authx.exceptions import JWTDecodeError
# from backend.auth import security
# from backend.database.crud import get_user_by_id
# from authx.exceptions import MissingTokenError

# async def get_current_user(request: Request):
#     try:
#         uid = await security.get_current_subject(request)
#     except MissingTokenError:
#         raise HTTPException(status_code=401, detail="Not authenticated")

#     user = get_user_by_id(uid)
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")

#     return user

# async def get_current_user_id(user: dict = Depends(get_current_user)):
#     return user["id"]
# backend/dependencies.py
from fastapi import Request, HTTPException, Depends
from authx.exceptions import JWTDecodeError
from backend.auth import security
from backend.database.crud import get_user_by_id

async def get_current_user(request: Request):
    try:
        uid = await security.get_current_subject(request)
    except JWTDecodeError:
        raise HTTPException(status_code=401, detail="JWT недействителен")

    user = get_user_by_id(int(uid))
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user

async def get_current_user_id(user: dict = Depends(get_current_user)):
    return user["id"]