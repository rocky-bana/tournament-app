from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from models.database import get_db
from models.team_model import Team, TeamsList

class TeamDBAccess:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_teams(self) -> Optional[TeamsList]:
        sqlStatement = text("""
            SELECT t.*, p.FirstName || ' ' || p.LastName as CaptainName 
            FROM teams t 
            LEFT JOIN players p ON t.captainid = p.playerid 
            LIMIT 100
        """)
        result = self.db.execute(sqlStatement)
        rows = result.mappings().all()

        items: List[Team] = [
            Team(
                TeamID=row["teamid"],
                TeamName=row["teamname"],
                CaptainID=row["captainid"],
                CaptainName=row["captainname"],
                CreatedAt=row["createdat"]
            )
            for row in rows
        ]
        return TeamsList(teams=items)
    
    async def create_team(self, teamdata: Team):
        sqlStatement = text("""
            INSERT INTO teams (teamname, captainid)
            VALUES (:teamname, :captainid)
            RETURNING TeamID
        """)
        result = self.db.execute(
            sqlStatement,
            {
                "teamname": teamdata.TeamName,
                "captainid": teamdata.CaptainID
            }
        )
        self.db.commit()
        return result.scalar()

    async def update_team(self, teamdata: Team):
        sqlStatement = text("""
            UPDATE teams SET 
            teamname = :teamname,
            captainid = :captainid
            WHERE teamid = :teamid
        """)
        self.db.execute(
            sqlStatement,
            {
                "teamid": teamdata.TeamID,
                "teamname": teamdata.TeamName,
                "captainid": teamdata.CaptainID
            }
        )
        self.db.commit()
        return teamdata.TeamID

    async def delete_team(self, team_id: int):
        sqlStatement = text("DELETE FROM teams WHERE teamid = :teamid")
        self.db.execute(sqlStatement, {"teamid": team_id})
        self.db.commit()
        return team_id

def teams_repository(db: AsyncSession = Depends(get_db)) -> TeamDBAccess:
    return TeamDBAccess(db)
