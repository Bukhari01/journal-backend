# Journal App - Backend

This is the backend for the Journal App. It provides endpoints for user authentication, session management, and CRUD operations on personal journal entries.

---

## Setup Instructions

Follow these steps to set up and run the backend server locally:

# 1. Clone the Repository

```bash
git clone https://github.com/Bukhari01/journal-backend.git
cd journal-backend
```

# 2. Install Dependencies 
```bash
npm install 
```

# 3. Start the server 
```bash
npm run dev
```

## How sessions work 
Every time a user logs in , a token is issued and tracked. 
Each session is stored in the database with the details of OS, device, browser and ip. 
If the number of sessions increase the session limit (2) , the oldest session is invalidated. 
Login and logout change the activity value to true or false. 

## Assumptions made
Sessions are limited by tracking tracking jwt tokens. 
Journals are private. Each user can see only their own journals entries. 





