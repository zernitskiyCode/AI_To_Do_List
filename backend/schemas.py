from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    surname : str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    user_id: int
    title: str
    description: str | None
    deadline: datetime | None
    priority: int = 1
    tag: str = "General"

