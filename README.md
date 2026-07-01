# FinVault — Full-Stack Banking Management System

FinVault is a full-stack banking management system built with Python, Flask, MySQL, and vanilla HTML/CSS/JavaScript, implementing core banking operations through a structured object-oriented architecture. The system provides **bcrypt-hashed authentication**, real-time transaction processing, and persistent data management via a relational database backend — accessible both through a REST API + web dashboard and a standalone CLI.

## Tech Stack

### Backend
- **Language:** Python 3.x
- **Framework:** Flask (REST API)
- **Database:** MySQL 8.0
- **Connector:** mysql-connector-python
- **Password Security:** bcrypt (salted hashing, never plaintext storage)
- **Environment Management:** python-dotenv
- **Version Control:** Git & GitHub

### Frontend
- **Vanilla HTML5, CSS3, JavaScript (ES6+)** — no framework, no build step, no dependencies
- **HTTP Client:** native Fetch API
- **Design:** custom "vault dial" visual identity — Fraunces (display serif) + IBM Plex Sans/Mono, dark ink-navy palette with brass, teal, and clay accents

> The frontend was deliberately rewritten from React/Vite to a dependency-free static site — open `index.html` directly or serve it with any static file server, with zero `npm install` required.

---

## Architecture

```
FinVault/
├── app.py                    # Flask REST API — all backend routes
├── bank.py                   # Core banking engine (OOP)
├── customer.py                # Customer entity — encapsulation + bcrypt hashing
├── database.py                # MySQL connection, schema, and query abstraction
├── register.py                # CLI authentication logic (SignUp/SignIn)
├── main.py                    # CLI driver (original CLI version)
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (not pushed)
├── .gitignore
├── README.md
└── finvault-frontend/         # Vanilla HTML/CSS/JS frontend
    ├── index.html              # Single-page app markup (auth + dashboard views)
    ├── css/
    │   └── style.css           # Vault-dial design system
    └── js/
        └── script.js           # App logic, view routing, Fetch API calls
```

---

## Features

### Authentication & Security
- Sign Up with unique username validation and randomized 8-digit account number generation
- Sign In with **bcrypt-verified** password comparison (`bcrypt.checkpw`)
- Password Reset with old-password verification and re-hashing of the new password
- Passwords are **never stored or transmitted in plaintext** on the backend — only a salted bcrypt hash (60 characters) is persisted

### Banking Operations
- **Balance Enquiry** — real-time balance fetch from database
- **Deposit** — add funds with atomic balance update and transaction logging
- **Withdrawal** — withdraw funds with insufficient-balance validation
- **Fund Transfer** — transfer between accounts with dual-ledger recording (debit + credit entries)
- **Transaction History** — full per-user transaction log
- **View Profile** — complete account and personal details
- **Sign Out** — secure session termination

---

## Database Design

### `customers` table
| Column | Type | Description |
|---|---|---|
| username | VARCHAR(20) | User identifier |
| password | VARCHAR(255) | Bcrypt password hash (never plaintext) |
| name | VARCHAR(20) | Full name |
| age | INTEGER | Age |
| city | VARCHAR(20) | City |
| balance | INTEGER | Current balance |
| account_number | INTEGER | Unique 8-digit account number |
| status | BOOLEAN | 1 = active, 0 = deactivated |

### `{username}_transaction` table
| Column | Type | Description |
|---|---|---|
| timedate | VARCHAR(30) | Timestamp of transaction |
| account_number | INTEGER | Account involved |
| remarks | VARCHAR(30) | Transaction description |
| amount | INTEGER | Transaction amount |

> Each user gets a dynamically created, isolated transaction table upon registration.

---

## Security

- **Bcrypt password hashing** — every password is hashed with a unique salt (`bcrypt.hashpw`) before it touches the database; login and password-reset flows verify against the hash (`bcrypt.checkpw`) rather than comparing raw strings
- Private class attributes using Python name mangling (`__username`, `__password`) for encapsulation
- Credentials externalized via `.env` file, excluded from version control via `.gitignore`
- Account status flag enabling soft delete without data loss

> **Note:** Query construction currently uses Python f-strings rather than parameterized queries. This is a known limitation flagged for a future hardening pass — parameterized queries (`%s` placeholders via `mysql-connector`) would close a SQL-injection surface that f-string interpolation leaves open.

---

## Setup Instructions

### Prerequisites
- Python 3.x installed
- MySQL 8.0 installed
- VS Code or any IDE
- A modern web browser (no Node.js or npm required)

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/aarushipd12/FinVault---Banking-Management-System.git
cd FinVault---Banking-Management-System
```

**2. Create and activate a virtual environment**
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up the MySQL database**
```sql
CREATE DATABASE bank_db;
```

**5. Create a `.env` file in the root directory**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD={yourpassword}
DB_NAME=bank_db
```

**6. Create the schema**
```bash
python database.py
```
This creates the `customers` table matching the schema above.

**7. Start the Flask backend**
```bash
python app.py
```
Runs on `http://127.0.0.1:5000`.

### Frontend Setup

No installation needed — the frontend is plain static files.

**In a separate terminal:**
```bash
cd finvault-frontend
python -m http.server 8080
```
Open **`http://localhost:8080`** in your browser.

> Both the backend (`python app.py`) and frontend server must be running at the same time, in separate terminals, for the app to work end to end.

---

## CLI Version

The original CLI version is still available and fully functional, now also using bcrypt:
```bash
python main.py
```

### CLI Usage
- On launch, choose **1 — Sign Up** or **2 — Sign In**
- After signing in, choose from the banking menu:
  - 1 — Balance Enquiry
  - 2 — Deposit
  - 3 — Withdrawal
  - 4 — Fund Transfer
  - 5 — Transaction History
  - 6 — View My Profile
  - 7 — Reset Password
  - 8 — Sign Out

---

## Application Flow

```
Landing Page
├── Open an account (Sign Up) → Dashboard
└── Access my vault (Sign In) → Dashboard

Dashboard
├── 01. Balance
├── 02. Deposit
├── 03. Withdraw
├── 04. Transfer
├── 05. History
├── 06. Profile
├── 07. Security (Reset Password)
└── 08. Sign Out
```

---

*Built by Aarushi Pandey*