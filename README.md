# FinVault — CLI-Based Banking Management System

FinVault is a command-line banking management system built with Python and MySQL, implementing core banking operations through a structured object-oriented architecture. The system provides secure user authentication, real-time transaction processing, and persistent data management via a relational database backend.

## Tech Stack
### Backend
- **Language:** Python 3.14
- **Framework:** Flask (REST API)
- **Database:** MySQL 8.0
- **Connector:** mysql-connector-python
- **Environment Management:** python-dotenv
- **Version Control:** Git & GitHub

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **Styling:** CSS3
- **HTTP Client:** Fetch API

---

## Architecture
FinVault/
├── app.py                  # Flask REST API — all backend routes

├── bank.py                 # Core banking engine (OOP)

├── customer.py             # Customer entity with encapsulation

├── database.py             # MySQL connection and query abstraction

├── register.py             # Authentication logic

├── main.py                 # CLI driver (original CLI version)

├── .env                    # Environment variables (not pushed)

├── .gitignore

├── README.md

└── finvault-frontend/      # React frontend

├── public/

├── src/

│   ├── assets/         # Static assets

│   ├── App.jsx         # Root component with routing

│   ├── App.css         # Global styles

│   ├── index.css       # Base styles

│   └── main.jsx        # React entry point

├── index.html

├── package.json

└── vite.config.js

## Features
### Authentication
- Sign Up with unique username validation and random account number generation
- Sign In with password verification
- Password Reset with old password verification and confirmation matching

### Banking Operations
- **Balance Enquiry** — Real-time balance fetch from database
- **Deposit** — Add funds with atomic balance update and transaction logging
- **Withdrawal** — Withdraw funds with insufficient balance validation
- **Fund Transfer** — Transfer between accounts with dual-ledger recording
- **Transaction History** — Full per-user transaction log
- **View Profile** — Complete account and personal details
- **Sign Out** — Secure session termination

## Database Design

### `customers` table
| Column | Type | Description |
|---|---|---|
| username | VARCHAR(20) | Unique user identifier |
| password | VARCHAR(20) | Account password |
| name | VARCHAR(20) | Full name |
| age | INTEGER | Age |
| city | VARCHAR(20) | City |
| account_number | INTEGER | Unique 8-digit account number |
| balance | INTEGER | Current balance |
| status | BOOLEAN | 1 = active, 0 = deactivated |

### `{username}_transaction` table
| Column | Type | Description |
|---|---|---|
| timedate | VARCHAR(30) | Timestamp of transaction |
| account_number | INTEGER | Account involved |
| remarks | VARCHAR(30) | Transaction description |
| amount | INTEGER | Transaction amount |

> Each user gets a dynamically created transaction table upon registration for isolated transaction history.

## Security
- Private class attributes using Python name mangling (`__username`, `__password`)
- Credentials externalized via `.env` file, excluded from version control via `.gitignore`
- Account status flag enabling soft delete without data loss

## Setup Instructions

### Prerequisites
- Python 3.x installed
- MySQL 8.0 installed
- VS Code or any IDE

### Installation
**1. Clone the repository**

git clone https://github.com/aarushipd12/FinVault---Banking-Management-System.git

cd FinVault---Banking-Management-System

**2. Install dependencies:**

pip install mysql-connector-python python-dotenv

**3. Set up MySQL database:**

Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE bank_db;
```

**4. Fix MySQL authentication (if needed):**

If you face authentication errors, run in MySQL/ cmd:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
```

**5. Create a `.env` file in the root directory:**

Create a file named `.env` and add:

DB_HOST=localhost

DB_USER=root

DB_PASSWORD={yourpassword}

DB_NAME=bank_db

**6. Start Flask Backend:**

python main.py  

---

## CLI Version
This was the original CLI version, available via: python main.py

### Usage
- On launch, choose **1 to Sign Up** or **2 to Sign In**
- After signing in, choose from the banking menu:
  - 1 — Balance Enquiry
  - 2 — Deposit
  - 3 — Withdrawal
  - 4 — Fund Transfer
  - 5 — Transaction History
  - 6 — View My Profile
  - 7 — Reset Password
  - 8 — Sign Out

### Frontend Setup

**7. Install frontend dependencies:**

cd finvault-frontend

npm install

**8. Start React frontend:**

npm run dev

Open link in your browser.

### Running Full Stack
Open two terminals simultaneously:

**Terminal 1:**

python app.py

**Terminal 2:**

cd finvault-frontend
npm run dev

---

## Application Flow

Landing Page
├── Sign Up → Enter credentials → Dashboard
└── Sign In → Enter credentials → Dashboard
Dashboard
├── 1. Balance Enquiry
├── 2. Deposit
├── 3. Withdrawal
├── 4. Fund Transfer
├── 5. Transaction History
├── 6. View Profile
├── 7. Reset Password
└── 8. Sign Out


---

*Built by Aarushi Pandey*
