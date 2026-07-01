#DATABASE 

import mysql.connector as sql

from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

mydb = sql.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    passwd=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
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
        password VARCHAR(255) NOT NULL,
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