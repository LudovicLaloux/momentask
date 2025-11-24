from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Habit as HabitModel
from schemas import Habit, HabitCreate, HabitUpdate
import uuid

router = APIRouter(prefix="/habits", tags=["Habits"])

@router.get("", response_model=list[Habit])
def get_habits(db: Session = Depends(get_db)):
    return db.query(HabitModel).all()

@router.get("/{habit_id}", response_model=Habit)
def get_habit(habit_id: uuid.UUID, db: Session = Depends(get_db)):
    habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit

@router.post("", response_model=Habit, status_code=201)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    new_habit = HabitModel(**habit.model_dump())
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit

@router.patch("/{habit_id}", response_model=Habit)
def update_habit(habit_id: uuid.UUID, habit: HabitUpdate, db: Session = Depends(get_db)):
    habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    update_data = habit.model_dump(exclude_unset=True)
    updated = habit.model_copy(update=update_data)
    db.add(updated)
    db.commit()
    db.refresh(updated)
    return updated

@router.delete("/{habit_id}", status_code=204)
def delete_habit(habit_id: uuid.UUID, db: Session = Depends(get_db)):
    habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()