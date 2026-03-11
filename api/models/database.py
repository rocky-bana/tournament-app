from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
# Database URL - replace with your actual database URL
load_dotenv()
db_user = os.getenv("AZURE_DB_USER")
db_password = os.getenv("AZURE_DB_PASSWORD")
db_host = os.getenv("AZURE_DB_HOST")
db_port = os.getenv("AZURE_DB_PORT")
db_name = os.getenv("AZURE_DB_NAME")
DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
