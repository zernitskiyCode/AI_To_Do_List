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
from backend.auth import security
from backend.database.user_utils import get_user_by_id
from fastapi.logger import logger
from authx.exceptions import MissingTokenError, JWTDecodeError

async def get_current_user(request: Request):
    try:
        # Используем access_token_required для получения токена и его декодирования
        token_payload = await security.access_token_required(request)
        
        # Получаем uid из payload
        uid = token_payload.get("sub") if isinstance(token_payload, dict) else getattr(token_payload, "sub", None)
        
        if not uid:
            raise HTTPException(status_code=401, detail="Некорректный токен")
            
        user = get_user_by_id(int(uid))
        if not user:
            logger.warning("Пользователь с UID %s не найден", uid)
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
        
    except MissingTokenError:
        logger.info("Токен отсутствует")
        raise HTTPException(status_code=401, detail="Токен отсутствует")
    except JWTDecodeError as e:
        logger.error("Ошибка декодирования токена: %s", e)
        raise HTTPException(status_code=401, detail="Некорректный токен")
    except Exception as e:
        logger.error("Ошибка аутентификации: %s", e)
        raise HTTPException(status_code=401, detail="Ошибка аутентификации")

async def get_current_user_id(user: dict = Depends(get_current_user)):
    try:
        user_id = user["id"]
        logger.info("ID пользователя: %s", user_id)
        return user_id
    except KeyError as e:
        logger.error("Ошибка получения ID пользователя: %s", e)
        raise HTTPException(status_code=500, detail="Ошибка получения ID пользователя")
