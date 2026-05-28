#Banking services

from database import *
import datetime

class Bank:
    def __init__(self, username, account_number):
        self.__username = username
        self.__account_number = account_number
        self.create_transaction_table()



    def create_transaction_table(self):
        db_query(f"""CREATE TABLE IF NOT EXISTS {self.__username}_transaction (
                 timedate VARCHAR(30),
                 account_number INTEGER,
                 remarks VARCHAR(30),
                 amount INTEGER )""")
        


    def balanceenquiry(self):
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{self.__username}';")
        print(f"Your account balance is {temp[0][0]}")



    def deposit(self, amount):
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{self.__username}';")
        test = amount + temp[0][0]
        db_query(f"UPDATE customers SET balance = {test} WHERE username = '{self.__username}';")
        self.balanceenquiry()
        db_query(f'''INSERT INTO {self.__username}_transaction VALUES (
                '{datetime.datetime.now()}',
                {self.__account_number},
                'Amount deposited',
                {amount} )''')
        print(f"Amount successfully deposited into your account, Acc.{self.__account_number};")


        
    def withdrawal(self, amount):
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{self.__username}';")
        if amount > temp[0][0]:
            print("Insufficient balance!")
        else:
            test = temp[0][0] - amount
            db_query(f"UPDATE customers SET balance = {test} WHERE username = '{self.__username}';")
            self.balanceenquiry()
            db_query(f'''INSERT INTO {self.__username}_transaction VALUES (
                    '{datetime.datetime.now()}',
                    {self.__account_number},
                    'Amount withdrawn',
                    {amount} )''')
            print(f"Amount is successfully withdrawn from your account, Acc. {self.__account_number};")


            
    def fundtransfer(self, receiver, amount):
        temp = db_query(f"SELECT balance FROM customers WHERE username = '{self.__username}';")
        if amount > temp[0][0]:
            print("Insufficient balance in your account!")
        else:
            temp2 = db_query(f"SELECT balance FROM customers WHERE account_number = {receiver};")
            if temp2 == []:
                print("Receiver's Account Number does not exist")
            else:
                test1 = temp[0][0] - amount
                test2 = amount + temp2[0][0]
                db_query(f"UPDATE customers SET balance = {test1} WHERE username = '{self.__username}'; ")
                db_query(f"UPDATE customers SET balance = {test2} WHERE account_number = {receiver}; ")
                receiver_username = db_query(f"SELECT username FROM customers WHERE account_number = {receiver};")
                self.balanceenquiry()

                db_query(f'''INSERT INTO {receiver_username[0][0]}_transaction VALUES (
                         '{datetime.datetime.now()}',
                         {self.__account_number},
                         'Fund Transfer from {self.__account_number}',
                         {amount})''')
                
                db_query(f'''INSERT INTO {self.__username}_transaction VALUES (
                         '{datetime.datetime.now()}',
                         '{self.__account_number}',
                         'Fund Transfer to {receiver}',
                         '{amount}')''')
                
                print(f"Amount is sucessfully debited from your account {self.__account_number}")



    def transaction_history(self):
        temp = db_query(f"SELECT * FROM {self.__username}_transaction")
        if temp:
            print(f"\n--- Transaction History for {self.__username} ---")
            for row in temp:
                print(f"Date: {row[0]} | Account: {row[1]} | Remarks: {row[2]} | Amount: {row[3]}")
        else:
            print("No transactions found!")



    def view_profile(self):
        temp = db_query(f"SELECT name, age, city, account_number FROM customers WHERE username = '{self.__username}'")
        print(f"\n--- My Profile ---")
        print(f"Username    : {self.__username}")
        print(f"Name        : {temp[0][0]}")
        print(f"Age         : {temp[0][1]}")
        print(f"City        : {temp[0][2]}")
        print(f"Account No  : {temp[0][3]}")