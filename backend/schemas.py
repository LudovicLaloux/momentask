from pydantic import BaseModel, ConfigDict
from datetime import date
import uuid

class HabitBase(BaseModel):
    name: str
    description: str | None = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

class Habit(HabitBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID

class CompletionCreate(BaseModel):
    habit_id: uuid.UUID
    completed_date: date

class Completion(CompletionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID