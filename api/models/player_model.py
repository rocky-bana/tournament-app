from pydantic import BaseModel

class Player(BaseModel) :
    PlayerID: int
    FirstName: str
    LastName: str
    PhoneNumber: str

    class Config:
        from_attributes = True

class Players(BaseModel):
    players: list[Player] 
    
    class Config:
        from_attributes = True