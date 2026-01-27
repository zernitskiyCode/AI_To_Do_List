from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import DictCursor
from backend.database.models import init_db
# from backend.database.models import test
from backend.database.crud import create_user, authenticate_user, get_info, get_user_tasks, create_task, delete_task_id, get_info_profile, update_task
from backend.schemas import UserCreate, UserLogin, TaskCreate, TaskCreate, TaskUpdate
# from fastapi import HTTPException
from backend.dependencies import get_current_user_id
from backend.auth import config
from backend.auth import security
from backend.dependencies import get_user_by_id


app = FastAPI()

app = FastAPI()

# security.set_user_model_callback(get_user_by_id)



# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- ROUTES ----------
# Инициализация бд
@app.on_event("startup")
def startup_event():
    print("Сервер стартовал!")
    init_db()
    print("База данных готова!")

# ---------- АВТОРИЗАЦИЯ ----------
@app.post("/registration", tags=["Авторизация"], summary="Регистрация пользователя")
def reg_user(user: UserCreate, response:Response):
    token = create_user(user)
    # response.set_cookie(config.JWT_ACCESS_COOKIE_NAME)
    response.set_cookie(
        key="my_access_token",  # имя куки
        value=token,            # сам JWT
        httponly=True,          # нельзя читать JS
        max_age=3600*24*7       # срок действия, например 7 дней
    )
    return {"msg" : "Пользователь создан", "access_token" : token}

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
def read_user_info(user_id : int = Depends(get_current_user_id)):
    user_data = get_info(user_id)
    return user_data

@app.post("logout", tags=["Авторизация"], summary="Выход")
def log_out(response:Response):
    response.delete_cookie(config.JWT_ACCESS_COOKIE_NAME)
    return {"msg" : "Выход выполнен"}

@app.get("/me", tags=["Авторизация"], summary="Проверка авторизации, возвращается id либо 401 - не авторризован")
def me(user_id: int = Depends(get_current_user_id)):
    if user_id:
        return user_id
    else:
        raise HTTPException(status_code=401, detail="Не авторизован.")

# ---------- ЗАДАЧИ ----------
@app.post("/createtask", tags=["Задачи"], summary="Создание задания")
def create_task_for_user(task: TaskCreate, user_id : int = Depends(get_current_user_id)):
    task_id = create_task(task, user_id)
    if not task_id:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return {"message": "Task created successfully", "task_id": task_id}

# Получение задач get_user_tasks
@app.get("/gettask", tags=["Задачи"], summary="Получение заданий")
def get_tasks(user_id : int = Depends(get_current_user_id)):
    tasks = get_user_tasks(user_id)  # Получить задачи пользователя из базы
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
    return tasks
# Удаление задачи по id
@app.delete("/tasks/{task_id}", tags=["Задачи"], summary="Удаление задачи")
def delete_task(task_id: int):
    try:
        delete_task_id(task_id)
        return {"message": "Задача успешно удалена"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении задачи: {e}")
# передаешь id пользователя, получаешь name, surname, email
@app.get("/getInfoProfile", tags=["Информация"], summary="Получение name, surname, email")
def getinfouser(user_id : int):
    try:
        data = get_info_profile(user_id)[0]
        print(data)
        return data
    except:
        raise HTTPException(status_code=400, detail="Ошибка при получении информации")

@app.patch("/tasks/{task_id}", tags=["Задачи"], summary="Обновление задачи")
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



@app.get("/", tags=["Тестирование"])
def read_root():
    return {"message": "server is working!"}