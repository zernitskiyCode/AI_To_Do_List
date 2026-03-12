from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import DictCursor
from backend.database.models import init_db, migrate_add_completed_at
# from backend.database.models import test
from backend.database.crud import create_user, authenticate_user, get_info, get_user_tasks, create_task, delete_task_id, get_info_profile, update_task, get_user_categories, get_all_user_categories, get_weekly_stats, get_user_streak
from backend.schemas import UserCreate, UserLogin, TaskCreate, TaskCreate, TaskUpdate
# from fastapi import HTTPException
from backend.auth import config, security
from backend.dependencies import get_current_user_id
from fastapi.logger import logger
import traceback



app = FastAPI()


# security.set_user_model_callback(get_user_by_id)



# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Добавляем обработчик для preflight запросов
@app.options("/{path:path}")
async def options_handler(request: Request, path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )


# ---------- ROUTES ----------
# Инициализация бд
@app.on_event("startup")
def startup_event():
    print("Сервер стартовал!")
    init_db()
    print("База данных готова!")
    migrate_add_completed_at()
    print("Миграции выполнены!")

# ---------- АВТОРИЗАЦИЯ ----------
@app.post("/registration", tags=["Авторизация"], summary="Регистрация пользователя")
def reg_user(user: UserCreate, response: Response):
    try:
        logger.info("Попытка регистрации пользователя: %s", user.email)
        token = create_user(user)
        response.set_cookie(
            key="my_access_token",  # имя куки
            value=token,            # сам JWT
            httponly=True,          # нельзя читать JS
            max_age=3600*24*7       # срок действия, например 7 дней
        )
        logger.info("Пользователь успешно зарегистрирован: %s", user.email)
        return {"msg": "Пользователь создан", "access_token": token}
    except Exception as e:
        logger.error("ОШИБКА РЕГИСТРАЦИИ: %s", str(e))
        logger.error("Traceback: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login", tags=["Авторизация"], summary="Авторизация пользователя")
def login_user(user: UserLogin, response:Response):
    token = authenticate_user(user)
    response.set_cookie(
        key="my_access_token",  # имя куки
        value=token,            # сам JWT
        httponly=True,          # нельзя читать JS
        max_age=3600*24*365      # срок действия, например 7 дней
    )
    security.set_access_cookies(
        response=response,
        token=token
    )

    return {"msg" : "Пользователь авторизован", "access_token" : token}

@app.get("/userinfo", tags=["Авторизация"], summary="Информация о пользователе")
def read_user_info(user_id: int = Depends(get_current_user_id)):
    try:
        logger.info("Получение информации о пользователе с ID: %s", user_id)
        user_data = get_info(user_id)
        return user_data
    except Exception as e:
        logger.error("Ошибка получения информации о пользователе: %s", e)
        raise HTTPException(status_code=500, detail="Ошибка получения информации о пользователе")

@app.post("/logout", tags=["Авторизация"], summary="Выход")
def log_out(response:Response):
    try:
        response.delete_cookie(config.JWT_ACCESS_COOKIE_NAME)
        return {"msg" : "Выход выполнен"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при выходе: {e}")

@app.get("/me", tags=["Авторизация"], summary="Проверка авторизации, возвращается id либо 401 - не авторизован")
def me(user_id: int = Depends(get_current_user_id)):
    try:
        logger.info("Проверка авторизации для пользователя с ID: %s", user_id)
        if user_id:
            return user_id
        else:
            raise HTTPException(status_code=401, detail="Не авторизован.")
    except Exception as e:
        logger.error("Ошибка при проверке авторизации: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка при проверке авторизации: {e}")

# ---------- ЗАДАЧИ ----------
@app.post("/createtask", tags=["Задачи"], summary="Создание задания")
def create_task_for_user(task: TaskCreate, user_id : int = Depends(get_current_user_id)):
    new_task = create_task(task, user_id)
    if not new_task:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return new_task

# Получение задач get_user_tasks
@app.get("/gettask", tags=["Задачи"], summary="Получение заданий")
def get_tasks(user_id : int = Depends(get_current_user_id)):
    tasks = get_user_tasks(user_id)  # Получить задачи пользователя из базы
    # Возвращаем пустой список вместо ошибки, если задач нет
    return tasks if tasks else []
# Удаление задачи по id
@app.delete("/deletetask/{task_id}", tags=["Задачи"], summary="Удаление задачи")
def delete_task(task_id: int):
    try:
        delete_task_id(task_id)
        return {"message": "Задача успешно удалена"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении задачи: {e}")

@app.put("/updatetask/{task_id}", tags=["Задачи"], summary="Обновление задачи")
def edit_task(task_id: int, data: TaskUpdate, user_id : int = Depends(get_current_user_id)):
    return update_task(task_id, data, user_id)
# передаешь id пользователя, получаешь name, surname, email
@app.get("/getInfoProfile", tags=["Информация"], summary="Получение name, surname, email")
def getinfouser(user_id : int = Depends(get_current_user_id)):
    try:
        data = get_info_profile(user_id)[0]
        print(data)
        return data
    except:
        raise HTTPException(status_code=400, detail="Ошибка при получении информации")

# Получение категорий пользователя (для фильтров - топ-6)
@app.get("/categories", tags=["Категории"], summary="Получение топ-6 самых используемых категорий для фильтров")
def get_categories(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает топ-6 самых используемых категорий для фильтров:
    - Дефолтные категории (work, personal, health, study)
    - Топ-6 самых используемых пользовательских категорий
    """
    try:
        categories = get_user_categories(user_id)
        return categories
    except Exception as e:
        logger.error("Ошибка при получении категорий: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка при получении категорий: {e}")

# Получение всех категорий пользователя (для формы создания задачи)
@app.get("/categories/all", tags=["Категории"], summary="Получение всех категорий пользователя")
def get_all_categories(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает ВСЕ категории пользователя (без ограничений):
    - Дефолтные категории (work, personal, health, study)
    - Все уникальные категории из задач пользователя
    """
    try:
        categories = get_all_user_categories(user_id)
        return categories
    except Exception as e:
        logger.error("Ошибка при получении всех категорий: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка при получении всех категорий: {e}")





@app.get("/", tags=["Тестирование"])
def read_root():
    return {"message": "server is working!"}


# ---------- СТАТИСТИКА ----------
@app.get("/stats/weekly", tags=["Статистика"], summary="Статистика за неделю")
def get_weekly_statistics(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает статистику за последние 7 дней.
    
    Ответ: [
        {
            "date": "2026-03-06",
            "completed": 3,
            "total": 10,
            "completionRate": 30.0
        },
        ... (7 дней)
    ]
    """
    try:
        stats = get_weekly_stats(user_id)
        return stats
    except Exception as e:
        logger.error("Ошибка при получении недельной статистики: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка: {e}")


@app.get("/stats/streak", tags=["Статистика"], summary="Стрик (дни подряд)")
def get_streak(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает количество дней подряд выполнения задач.
    
    Ответ: { "streak": 7 }
    """
    try:
        streak = get_user_streak(user_id)
        return {"streak": streak}
    except Exception as e:
        logger.error("Ошибка при получении стрика: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка: {e}")
