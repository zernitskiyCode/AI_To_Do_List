from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    name: str
    surname : str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# class TaskCreate(BaseModel):
#     user_id: int
#     title: str
#     description: str | None
#     deadline: datetime | None
#     priority: int = 1
#     tag: str = "General"
    
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = "medium"  # 'low', 'medium', 'high'
    tag: Optional[str] = "personal"
class TaskUpdate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None
    deadline: Optional[datetime] = None 
    priority: Optional[str] = None  # 'low', 'medium', 'high'
    completed: Optional[bool] = None        
    tag: Optional[str] = None  # category (в БД называется tag)  
