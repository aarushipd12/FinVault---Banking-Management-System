#User registration: SignUp / SignIn
import random

from customer import *
from bank import Bank
from database import *
def SignUp():
    username = input("Create Username: ")
    temp = db_query(f"SELECT username FROM customers where username = '{username}';")
    if temp:
        print("Username Already Exists")
        SignUp()

    else:
        print("Username is unique! Please proceed.")
        password = input("Enter Your Password: ")
        name = input("Enter Your Name: ")
        age = input("Enter Your Age: ")
        city = input("Enter Your City: ")
        while True:
            account_number = int(random.randint(10000000, 99999999))
            temp = db_query(f"SELECT account_number FROM customers WHERE account_number = '{account_number}';")
            if temp:
                continue
            else:
                print("Your account number: ", account_number)
                break

    customer_obj = Customer(username, password, name, age, city, account_number)
    customer_obj.createUser()

    bank_obj = Bank(username, account_number)
    bank_obj.create_transaction_table()

def SignIn():
    username = input("Enter username: ")
    temp = db_query(f"SELECT account_number FROM customers WHERE username = '{username}';")
    if temp:
        while True:
            password = input(f"Welcome {username} Enter Your Password: ")
            temp = db_query(f"SELECT password FROM customers WHERE username = '{username}';")
            if temp[0][0] == password:
                print("Successfully Signed In!\n")
                return username
            else:
                print("Wrong password. Please retry!") 
                continue
    else:
        print("Username does not exist.")
        SignIn()