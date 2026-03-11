from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from models.database import get_db
from models.match_model import Match, MatchList

class MatchDBAccess:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_matches(self) -> Optional[MatchList]:
        sqlStatement = text("""
            SELECT m.*, t1.TeamName as Team1Name, t2.TeamName as Team2Name
            FROM matches m
            JOIN teams t1 ON m.team1id = t1.teamid
            JOIN teams t2 ON m.team2id = t2.teamid
            ORDER BY m.matchdate ASC
        """)
        result = self.db.execute(sqlStatement)
        rows = result.mappings().all()

        items: List[Match] = [
            Match(
                MatchID=row["matchid"],
                Team1ID=row["team1id"],
                Team2ID=row["team2id"],
                MatchDate=row["matchdate"],
                Location=row["location"],
                Status=row["status"],
                Team1Name=row["team1name"],
                Team2Name=row["team2name"]
            )
            for row in rows
        ]
        return MatchList(matches=items)
    
    async def create_match(self, matchdata: Match):
        sqlStatement = text("""
            INSERT INTO matches (team1id, team2id, matchdate, location, status)
            VALUES (:team1id, :team2id, :matchdate, :location, :status)
            RETURNING MatchID
        """)
        result = self.db.execute(
            sqlStatement,
            {
                "team1id": matchdata.Team1ID,
                "team2id": matchdata.Team2ID,
                "matchdate": matchdata.MatchDate,
                "location": matchdata.Location,
                "status": matchdata.Status
            }
        )
        self.db.commit()
        return result.scalar()

    async def update_match(self, matchdata: Match):
        sqlStatement = text("""
            UPDATE matches SET 
            team1id = :team1id,
            team2id = :team2id,
            matchdate = :matchdate,
            location = :location,
            status = :status
            WHERE matchid = :matchid
        """)
        self.db.execute(
            sqlStatement,
            {
                "matchid": matchdata.MatchID,
                "team1id": matchdata.Team1ID,
                "team2id": matchdata.Team2ID,
                "matchdate": matchdata.MatchDate,
                "location": matchdata.Location,
                "status": matchdata.Status
            }
        )
        self.db.commit()
        return matchdata.MatchID

    async def delete_match(self, match_id: int):
        sqlStatement = text("DELETE FROM matches WHERE matchid = :matchid")
        self.db.execute(sqlStatement, {"matchid": match_id})
        self.db.commit()
        return match_id

def matches_repository(db: AsyncSession = Depends(get_db)) -> MatchDBAccess:
    return MatchDBAccess(db)
