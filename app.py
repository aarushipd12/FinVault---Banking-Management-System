from flask import Flask, request, jsonify
from flask_cors import CORS
import random

# Direct integration of your internal systems
from database import *
from customer import *
from bank import Bank
from register import *

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "FinVault API is running!"

# ==========================================
# FLOW GATE 1: CUSTOMER SIGNUP
# ==========================================
@app.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    age = data.get('age')
    city = data.get('city')
    
    # Mirroring your register.py SignUp uniqueness validation logic
    temp = db_query(f"SELECT username FROM customers where username = '{username}';")
    if temp:
        return jsonify({"success": False, "message": "Username Already Exists"}), 400
        
    # Unique 8-digit randomized account sequence matching your while loop loop
    while True:
        account_number = int(random.randint(10000000, 99999999))
        check_acc = db_query(f"SELECT account_number FROM customers WHERE account_number = '{account_number}';")
        if not check_acc:
            break
            
    try:
        # Initiating your exact custom Customer class constructor layout
        customer_obj = Customer(username, password, name, age, city, account_number)
        customer_obj.createUser()
        
        # Spawning user dedicated transaction metrics tables
        bank_obj = Bank(username, account_number)
        bank_obj.create_transaction_table()
        
        return jsonify({"success": True, "account_number": account_number}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# FLOW GATE 2: SIGNIN INTERCEPTOR
# ==========================================
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Mirroring SignIn execution verification rules from register.py
    temp = db_query(f"SELECT account_number FROM customers WHERE username = '{username}';")
    if not temp:
        return jsonify({"success": False, "message": "Username does not exist."}), 404
        
    password_check = db_query(f"SELECT password FROM customers WHERE username = '{username}';")
    if password_check[0][0] == password:
        return jsonify({
            "success": True,
            "username": username,
            "account_number": temp[0][0]
        }), 200
    else:
        return jsonify({"success": False, "message": "Wrong password. Please retry!"}), 401

# ==========================================
# BANKING OPERATIONAL CORE (SERVICES 1 - 7)
# ==========================================

@app.route('/api/balance', methods=['POST'])
def api_balance():
    data = request.json
    username = data.get('username')
    try:
        res = db_query(f"SELECT balance FROM customers WHERE username = '{username}';")
        balance_val = res[0][0] if res and res[0][0] is not None else 0
        return jsonify({"success": True, "balance": float(balance_val)}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/deposit', methods=['POST'])
def api_deposit():
    data = request.json
    username = data.get('username')
    account_no = data.get('account_number')
    amount = int(data.get('amount', 0))
    
    try:
        bank_obj = Bank(username, account_no)
        bank_obj.deposit(amount)
        mydb.commit() # Commit database sequence exactly like main.py
        return jsonify({"success": True, "message": f"Successfully deposited ₹{amount} into account!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/withdraw', methods=['POST'])
def api_withdraw():
    data = request.json
    username = data.get('username')
    account_no = data.get('account_number')
    amount = int(data.get('amount', 0))
    
    try:
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{username}';")
        if amount > temp[0][0]:
            return jsonify({"success": False, "message": "Insufficient balance allocation inside vault!"}), 200
            
        bank_obj = Bank(username, account_no)
        bank_obj.withdrawal(amount)
        mydb.commit()
        return jsonify({"success": True, "message": f"Successfully withdrawn ₹{amount} from vault allocation."}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/transfer', methods=['POST'])
def api_transfer():
    data = request.json
    username = data.get('username')
    account_no = data.get('account_number')
    receiver = int(data.get('receiver'))
    amount = int(data.get('amount', 0))
    
    try:
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{username}';")
        if amount > temp[0][0]:
            return jsonify({"success": False, "message": "Insufficient balance in your account!"}), 200
            
        temp2 = db_query(f"SELECT balance FROM customers WHERE account_number = {receiver};")
        if not temp2:
            return jsonify({"success": False, "message": "Receiver's Account Number does not exist"}), 200
            
        bank_obj = Bank(username, account_no)
        bank_obj.fundtransfer(receiver, amount)
        mydb.commit()
        return jsonify({"success": True, "message": f"Successfully transferred ₹{amount} directly to account {receiver}!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/history', methods=['POST'])
def api_history():
    data = request.json
    username = data.get('username')
    try:
        temp = db_query(f"SELECT * FROM {username}_transaction")
        return jsonify({"success": True, "history": temp}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/profile', methods=['POST'])
def api_profile():
    data = request.json
    username = data.get('username')
    try:
        temp = db_query(f"SELECT name, age, city, account_number FROM customers WHERE username = '{username}'")
        profile_map = {
            "name": temp[0][0],
            "age": temp[0][1],
            "city": temp[0][2],
            "account_number": temp[0][3]
        }
        return jsonify({"success": True, "profile": profile_map}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/reset-password', methods=['POST'])
def api_reset_password():
    data = request.json
    username = data.get('username')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    try:
        temp = db_query(f"SELECT password FROM customers WHERE username = '{username}'")
        if temp and temp[0][0] == old_password:
            db_query(f"UPDATE customers SET password = '{new_password}' WHERE username = '{username}'")
            mydb.commit()
            return jsonify({"success": True, "message": "Password updated successfully!"}), 200
        return jsonify({"success": False, "message": "Wrong current password. Try again!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)