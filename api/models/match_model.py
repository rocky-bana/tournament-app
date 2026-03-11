from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Match(BaseModel):
    MatchID: int
    Team1ID: int
    Team2ID: int
    MatchDate: datetime
    Location: Optional[str] = None
    Status: Optional[str] = "Scheduled"
    Team1Name: Optional[str] = None
    Team2Name: Optional[str] = None

    class Config:
        from_attributes = True

class MatchList(BaseModel):
    matches: List[Match]

    class Config:
        from_attributes = True
