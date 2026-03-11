# System Design

## System Architecture
The Tournament Management System follows a 3-tier architecture:
1.  **Presentation Tier**: Built with React and TypeScript, styled with Tailwind CSS v4 and Material UI.
2.  **Logic Tier**: A RESTful API built using FastAPI (Python), handling business logic and data validation.
3.  **Data Tier**: A PostgreSQL database for persistent storage.

## Technology Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Material AI components.
- **Backend**: Python 3.x, FastAPI, SQLAlchemy, Pydantic.
- **Database**: PostgreSQL with structured SQL schema.

## Database Schema (ERD)

```mermaid
erDiagram
    PLAYERS ||--o{ TEAMS : "captains"
    PLAYERS ||--o{ TEAMMEMBERS : "belongs to"
    TEAMS ||--o{ TEAMMEMBERS : "has"
    TEAMS ||--o{ MATCHES : "competes in (Team 1)"
    TEAMS ||--o{ MATCHES : "competes in (Team 2)"

    PLAYERS {
        int PlayerID PK
        string FirstName
        string LastName
        string PhoneNumber
    }

    TEAMS {
        int TeamID PK
        string TeamName
        int CaptainID FK
        timestamp CreatedAt
    }

    TEAMMEMBERS {
        int TeamID PK, FK
        int PlayerID PK, FK
        timestamp JoinedAt
    }

    MATCHES {
        int MatchID PK
        int Team1ID FK
        int Team2ID FK
        timestamp MatchDate
        string Location
        string Status
    }
```
