# Habits Quest 4 Life

Habits Quest 4 Life is a unique application designed to help users build positive habits through a gamified daily quest system. The project leverages a Fetch.ai agent, which acts as a Game Master to generate personalized daily quests. The application is built on the DFINITY Internet Computer (IC), with a Motoko backend and a Next.js frontend.

## Key Features
- Gamified Habit Building: Users receive daily quests to help them form good habits.
- Fetch.ai Agent Integration: A dedicated agent dynamically generates quests based on user roles and levels.
- Secure Authentication: User login is handled via Internet Identity.
- Multi-Platform Setup: The project includes setup scripts for both Linux/macOS and Windows.

---

## Fetch.ai Agent Details

The project includes a Fetch.ai agent 'HQ4L-Agent'. This agent's primary function is to generate a list of five dailu quests based on user input, such as their role and level. It handles two main protocols:
- Chat Protocol: Responds to user chat messages by generating five daily quests.
- Quest Protocol: Generates five daily quests based on a structured request model.

---

## Local Development Setup

To run this project locally, you need to have the DFINITY Canister SDK ('dfx') and 'npm' installed.

### 1. Install Dependencies

**For Linux/macOS:**
```bash
cd src/frontend
npm install
npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal
```
Or, you can simply run the provided script:
```bash
cd src/frontend/scripts
./setup-dependencies.sh
```
**For Windows**
```bash
cd src/frontend
npm install
npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal
```
Alternatively, use the script
```bash
cd src/frontend/scripts
.\setup-dependencies.bat
```
### 2. Run the Project

Follow these simple steps in order to start he local environtment:

#### 1. Start the DFINITY local replica:
```bash
dfx start
```
#### 2. Deploy the canisters
```bash
dfx deploy
```
#### 3. Start the frontend development server:
```bash
cd src/frontend
npm run dev
```

