# FinVault — CLI-Based Banking Management System

FinVault is a command-line banking management system built with Python and MySQL, implementing core banking operations through a structured object-oriented architecture. The system provides secure user authentication, real-time transaction processing, and persistent data management via a relational database backend.

## Tech Stack
- **Language:** Python 3.14
- **Database:** MySQL 8.0 (via mysql-connector-python)
- **Environment Management:** python-dotenv for secure credential handling
- **Version Control:** Git & GitHub

## Architecture
The project follows a modular OOP architecture with separation of concerns across 5 core modules:
- `database.py` — MySQL connection, cursor management, and unified db_query() abstraction layer
- `customer.py` — User entity with private attributes (encapsulation) and database insertion logic
- `register.py` — Authentication flow including unique username validation and password verification
- `bank.py` — Core banking engine implementing all transactional operations as class methods
- `main.py` — CLI driver with input validation, exception handling, and session state management

## Features
- Sign Up / Sign In with unique username validation
- Real-time Balance Enquiry
- Deposit & Withdrawal with atomic balance updates
- Fund Transfer between accounts with dual-ledger transaction recording
- Per-user dynamic transaction tables for isolated transaction history
- View Profile with full account details
- Password Reset with old password verification
- Input validation with try/except throughout

## Database Design
- **`customers` table** — stores credentials, personal details, account number, and account status
- **`{username}_transaction` tables** — dynamically created per user at registration for full audit trail

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

DB_HOST=localhost\n
DB_USER=root\n
DB_PASSWORD={yourpassword}\n
DB_NAME=bank_db

**6. Run the application:**

python main.py

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
