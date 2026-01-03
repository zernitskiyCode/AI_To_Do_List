from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import DictCursor
from backend.database.models import init_db
# from backend.database.models import test
from backend.database.crud import create_user, authenticate_user, get_info, get_user_tasks, create_task
from backend.schemas import UserCreate, UserLogin, TaskCreate, TaskCreate
from fastapi import HTTPException

app = FastAPI()
#  {
#   "name": "artem",
#   "surname": "zernitskiy",
#   "email": "aaz.zernitskiy@yandex.ru",
#   "password": "Am012724"
# }




# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Пока все,потом http://localhost:5173/
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # ---------- DB ----------
# def get_conn():
#     return psycopg2.connect(
#         host="localhost",
#         user="postgres",
#         password="admin",
#         port=5432,
#         dbname="todo"
#     )

# # ---------- MODELS ----------
# class UserCreate(BaseModel):
#     firstName: str
#     lastName: str

# ---------- ROUTES ----------
# Инициализация бд
@app.on_event("startup")
def startup_event():
    print("Сервер стартовал!")
    init_db()
    print("База данных готова!")

# ---------- АВТОРИЗАЦИЯ ----------
@app.post("/registration", tags=["Авторизация"], summary="Регистрация пользователя")
def reg_user(user: UserCreate):
    user_id = create_user(user)
    return {"msg" : "Пользователь создан", "user_id" : user_id}

@app.post("/login", tags=["Авторизация"], summary="Авторизация пользователя")
def login_user(user: UserLogin):
    user_id = authenticate_user(user)
    return {"msg" : "Пользователь авторизован", "user_id" : user_id}

@app.get("/userinfo", tags=["Авторизация"], summary="Информация о пользователе")
def read_user_info():
    user_data = get_info()
    return user_data


# ---------- ЗАДАЧИ ----------
@app.post("/createtask", tags=["Задачи"], summary="Создание задания")
def create_task_for_user(task: TaskCreate, user_id: int):
    task_id = create_task(task, user_id)
    if not task_id:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return {"message": "Task created successfully", "task_id": task_id}

# Получение задач get_user_tasks
@app.get("/gettask", tags=["Задачи"], summary="Получение заданий")
def get_tasks(user_id: int):
    tasks = get_user_tasks(user_id)  # Получить задачи пользователя из базы
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
    return tasks




@app.get("/", tags=["Тестирование"])
def read_root():
    return {"message": "server is working!"}

