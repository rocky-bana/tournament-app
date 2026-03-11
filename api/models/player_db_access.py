from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from models.database import get_db
from models.player_model import Player, Players
from string import Template


class PlayerDBAccess:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_players(self) -> Optional[Players]:
        sqlStatement = text("SELECT * FROM players LIMIT 100")
        result = self.db.execute(sqlStatement)
        rows = result.mappings().all()

        items: List[Player] = [
            Player(
                PlayerID=row["playerid"],
                FirstName=row["firstname"],
                LastName=row["lastname"],
                PhoneNumber=row["phonenumber"],
            )
            for row in rows
        ]

        # Return empty list if none (simpler for callers than Optional)
        return Players(players=items)
    
    async def create_player(self, playerdata:Player):
        sqlStatement = text("""
            INSERT INTO players (firstname, lastname, phonenumber)
            VALUES (:firstname, :lastname, :phonenumber)
            RETURNING PlayerID  -- Get the ID of the inserted row
            """)
      
        result = self.db.execute(
        sqlStatement,
        {
            "firstname": playerdata.FirstName,
            "lastname": playerdata.LastName,
            "phonenumber": playerdata.PhoneNumber
        }
        )
        self.db.commit()
        # Get the inserted player's ID
        player_id = result.scalar()
        return player_id

    async def update_player(self, playerdata:Player):
        sqlStatement = text("""
            update players set 
            firstname = :firstname,
            lastname = :lastname,
            phonenumber = :phonenumber
            where playerid = :playerid;
            """)
      
        result = self.db.execute(
        sqlStatement,
        {
            "playerid": playerdata.PlayerID,
            "firstname": playerdata.FirstName,
            "lastname": playerdata.LastName,
            "phonenumber": playerdata.PhoneNumber
        }
        )
        self.db.commit()
        return playerdata.PlayerID

    async def delete_player(self, player_id: int):
        sqlStatement = text("DELETE FROM players WHERE playerid = :playerid")
        result = self.db.execute(sqlStatement, {"playerid": player_id})
        self.db.commit()
        return player_id
    
    

      

def players_repository(db: AsyncSession = Depends(get_db)) -> PlayerDBAccess:
    return PlayerDBAccess(db)
  