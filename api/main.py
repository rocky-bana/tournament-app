from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import os
from dotenv import load_dotenv
from fastapi.params import Depends

from models.player_model import Player
from models.player_db_access import PlayerDBAccess, players_repository
from models.team_model import Team
from models.team_db_access import TeamDBAccess, teams_repository
from models.match_model import Match
from models.match_db_access import MatchDBAccess, matches_repository

load_dotenv()

APP_URL = os.getenv("APP_URL")

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[APP_URL],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def read_root():
    return {"Name": "Rudra"}


@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id % 2 == 0:
        return {"Id": item_id, "Name": "Id is even"}
    else:
        return {"Id": item_id, "Name": "Id is odd"}

@app.get("/players")
async def get_all_players(repo: PlayerDBAccess  = Depends(players_repository)):
    players = await repo.get_all_players()
    if players is None:
        raise HTTPException(status_code=404, detail="No players found")
    return players

@app.post("/players")
async def create_player(player_data:Player, repo: PlayerDBAccess  = Depends(players_repository)):
    player = await repo.create_player(playerdata=player_data)
    if player is None:
        raise HTTPException(status_code=400, detail="Player could not be created")
    return player

@app.get("/teams")
async def get_all_teams(repo: TeamDBAccess = Depends(teams_repository)):
    teams = await repo.get_all_teams()
    if teams is None:
        raise HTTPException(status_code=404, detail="No teams found")
    return teams

@app.post("/teams")
async def create_team(team_data: Team, repo: TeamDBAccess = Depends(teams_repository)):
    team_id = await repo.create_team(teamdata=team_data)
    if team_id is None:
        raise HTTPException(status_code=400, detail="Team could not be created")
    return {"message": "Team created successfully", "id": team_id}

@app.put("/teams")
async def update_team(team_data: Team, repo: TeamDBAccess = Depends(teams_repository)):
    updated_id = await repo.update_team(teamdata=team_data)
    if updated_id is None:
        raise HTTPException(status_code=400, detail="Team could not be updated")
    return {"message": "Team updated successfully", "id": updated_id}

@app.delete("/teams/{team_id}")
async def delete_team(team_id: int, repo: TeamDBAccess = Depends(teams_repository)):
    deleted_id = await repo.delete_team(team_id=team_id)
    if deleted_id is None:
        raise HTTPException(status_code=400, detail="Team could not be deleted")
    return {"message": "Team deleted successfully", "id": deleted_id}

@app.delete("/players/{player_id}")
async def delete_player(player_id: int, repo: PlayerDBAccess = Depends(players_repository)):
    deleted_id = await repo.delete_player(player_id=player_id)
    if deleted_id is None:
        raise HTTPException(status_code=400, detail="Player could not be deleted")
    return {"message": "Player deleted successfully", "id": deleted_id}

# Match Endpoints
@app.get("/matches")
async def get_all_matches(repo: MatchDBAccess = Depends(matches_repository)):
    matches = await repo.get_all_matches()
    if matches is None:
        raise HTTPException(status_code=404, detail="No matches found")
    return matches

@app.post("/matches")
async def create_match(match_data: Match, repo: MatchDBAccess = Depends(matches_repository)):
    match_id = await repo.create_match(matchdata=match_data)
    if match_id is None:
        raise HTTPException(status_code=400, detail="Match could not be created")
    return {"message": "Match created successfully", "id": match_id}

@app.put("/matches")
async def update_match(match_data: Match, repo: MatchDBAccess = Depends(matches_repository)):
    updated_id = await repo.update_match(matchdata=match_data)
    if updated_id is None:
        raise HTTPException(status_code=400, detail="Match could not be updated")
    return {"message": "Match updated successfully", "id": updated_id}

@app.delete("/matches/{match_id}")
async def delete_match(match_id: int, repo: MatchDBAccess = Depends(matches_repository)):
    deleted_id = await repo.delete_match(match_id=match_id)
    if deleted_id is None:
        raise HTTPException(status_code=400, detail="Match could not be deleted")
    return {"message": "Match deleted successfully", "id": deleted_id}

@app.put("/players")
async def update_player(player_data:Player, repo: PlayerDBAccess  = Depends(players_repository)):
    player = await repo.update_player(playerdata=player_data)
    if player is None:
        raise HTTPException(status_code=400, detail="Player could not be updated")
    return player