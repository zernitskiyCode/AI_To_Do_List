from backend.database.db_connection import get_db_connection
from fastapi import HTTPException

def get_user_by_id(uid: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (uid,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")
            return dict(user)