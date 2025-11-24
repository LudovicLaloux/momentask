from datetime import date
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import Completion, CompletionCreate
from database import get_db, Habit as HabitModel, Completion as CompletionModel

router = APIRouter(prefix="/completions", tags=["Completions"])

@router.get("", response_model=list[Completion])
def get_completions(habit_id: UUID | None = None, db: Session = Depends(get_db)):
    """Get completions, optionally filtered by habit_id"""
    if habit_id is None:
        return list(db.query(CompletionModel).all())
    return [c for c in db.query(CompletionModel).all() if c.habit_id == habit_id]


@router.post("", response_model=Completion, status_code=201)
def create_completion(completion: CompletionCreate, db: Session = Depends(get_db)):
    
    # Check if the habit exists
    if completion.habit_id not in db.query(HabitModel).all():
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Check if we already have a completion for this date
    existing = [
        c for c in db.query(CompletionModel).all()
        if c.habit_id == completion.habit_id and c.completed_date == completion.completed_date
    ]
    if existing:
        raise HTTPException(status_code=409, detail="Already completed for this date")
    
    new_completion = CompletionModel(**completion.model_dump())
    db.add(new_completion)
    db.commit()
    db.refresh(new_completion)
    return new_completion


@router.delete("/{completion_id}", status_code=204)
def delete_completion(completion_id: UUID, db: Session = Depends(get_db)):
    """Delete a completion by ID"""
    if completion_id not in db.query(CompletionModel).filter(CompletionModel.id == completion_id).all():
        raise HTTPException(status_code=404, detail="Completion not found")
    db.delete(completion_id)
    db.commit()