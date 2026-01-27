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
    user_id: int
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[int] = 1
    tag: Optional[str] = "General"
# Ебанное говно не работает
class TaskUpdate(BaseModel):
    user_id: int           
    task_id : int
    title: Optional[str] = None 
    description: Optional[str] = None
    deadline: Optional[datetime] = None 
    priority: Optional[str] = None  
    created_at: Optional[datetime] = None           
    completed: Optional[bool] = None        
    tags: Optional[str] = None  