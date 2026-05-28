#DATABASE 

import mysql.connector as sql

from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

mydb = sql.connect(
    host="localhost",
    user="root",
    passwd="Aa@22072014",
    database="bank_db"
)

mycursor = mydb.cursor()

def db_query(str):
    mycursor.execute(str)
    result = mycursor.fetchall()
    return result


def createCustomerTable():
    # status tracks if account is active(1/true) or deactivated(0/false)
    mycursor.execute('''
        CREATE TABLE IF NOT EXISTS customers
        (username VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL,
        name VARCHAR(20) NOT NULL,
        age INTEGER NOT NULL,
        city VARCHAR(20) NOT NULL,
        balance INTEGER NOT NULL,             
        account_number INTEGER NOT NULL,
        status BOOLEAN NOT NULL)                
    ''')

    mydb.commit()
    print("Table created successfully!")

if __name__=="__main__":
        createCustomerTable()