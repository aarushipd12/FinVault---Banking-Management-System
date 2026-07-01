#Customer Details

import bcrypt
from database import *

class Customer:
    def __init__(self, username, password, name, age, city,  account_number):
        self.__username = username
        self.__password = self.hash_password(password)
        self.__name = name                  
        self.__age = age
        self.__city = city
        self.__account_number = account_number

    @staticmethod
    def hash_password(plain_password):
        return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(plain_password, hashed_password):
        """Compare a plaintext password against a stored bcrypt hash. Used during login."""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    def createUser(self):
        db_query(f"INSERT INTO customers VALUES ('{self.__username}', '{self.__password}', '{self.__name}', {self.__age}, '{self.__city}', 0, {self.__account_number}, 1) ")
        mydb.commit()