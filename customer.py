#Customer Details

from database import *

class Customer:
    def __init__(self, username, password, name, age, city,  account_number):
        self.__username = username          # double underscore.__ - makes the variable private, # implies access only from inside the class
        self.__password = password          # ENCAPSULATION!
        self.__name = name                  
        self.__age = age
        self.__city = city
        self.__account_number = account_number

    def createUser(self):
        db_query(f"INSERT INTO customers VALUES ('{self.__username}', '{self.__password}', '{self.__name}', {self.__age}, '{self.__city}', 0, {self.__account_number}, 1) ")
        mydb.commit()