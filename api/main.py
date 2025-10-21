from typing import Union
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id % 2 == 0:
        return {"Id": item_id, "Name": "Id is even"}
    else:
        return {"Id": item_id, "Name": "Id is odd"}

