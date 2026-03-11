from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Team(BaseModel):
    TeamID: int
    TeamName: str
    CaptainID: Optional[int] = None
    CaptainName: Optional[str] = None
    CreatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

class TeamsList(BaseModel):
    teams: List[Team]

    class Config:
        from_attributes = True

class TeamMember(BaseModel):
    TeamID: int
    PlayerID: int
    JoinedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
