from register import *
from bank import *
status = False

print("Welcome to FinVault\n")

while True:
    try:
        register = int(input("1. SignUp\n"
                             "2. SignIn\t"))
        if register == 1 or register == 2:
            if register == 1:
                SignUp()
            if register == 2:
                user = SignIn()
                status = True
                break
        else:
            print("\nPlease enter valid input, from the options\n")

    except ValueError:
        print("\nInvalid Input. Please try again using given options only!\n")

account_number = db_query(f"SELECT account_number FROM customers WHERE username = '{user}';")

print(f"Greetings! What banking service are you looking for? Choose by entering its numeric!")
while status:
    print("\nEnter the numeric of the banking service you are looking for- ")
    try:
        facility = int(input("1. Balance Enquiry\n"
                             "2. Deposit\n"
                             "3. Withdrawal\n"
                             "4. Fund Transfer\n"
                             "5. Transaction History\n"
                             "6. View My Profile\n"
                             "7. Reset password\n"
                             "8. Sign Out\n\n"
                             "Enter: "))
        if facility >= 1 or facility <= 8:
            if facility == 1:
                bank_obj = Bank(user, account_number[0][0])
                bank_obj.balanceenquiry()
            elif facility == 2:
                while True:
                    try:
                        amount = int(input("Enter amount to deposit: "))
                        bank_obj = Bank(user, account_number[0][0])
                        bank_obj.deposit(amount)
                        mydb.commit()
                        break
                    except ValueError:
                        print("Enter amount in numbers ONLY.")
                        continue
            elif facility == 3:
                while True:
                    try:
                        amount = int(input("Enter amount to withdraw: "))
                        bank_obj = Bank(user, account_number[0][0])
                        bank_obj.withdrawal(amount)
                        mydb.commit()
                        break
                    except ValueError:
                        print("Enter amount in numbers ONLY.")
                        continue
            elif facility == 4:
                while True:
                    try:
                        receiver = int(input("Enter Receiver's Account Number: "))
                        amount = int(input("Enter amount to transfer"))
                        bank_obj = Bank(user, account_number[0][0])
                        bank_obj.fundtransfer(receiver, amount)
                        mydb.commit()
                        break
                    except ValueError:
                        print("Enter amount in numbers ONLY.")
                        continue

            elif facility == 5:
                bank_obj = Bank(user, account_number[0][0])
                bank_obj.transaction_history()

            elif facility == 6:
                bank_obj = Bank(user, account_number[0][0])
                bank_obj.view_profile()

            elif facility == 7:
                while True:
                    old_password = input("Enter your current password: ")
                    temp = db_query(f"SELECT password FROM customers WHERE username = '{user}'")
                    if Customer.verify_password(old_password, temp[0][0]):
                        new_password = input("Enter new password: ")
                        confirm_password = input("Confirm new password: ")
                        if new_password == confirm_password:
                            new_hash = Customer.hash_password(new_password)
                            db_query(f"UPDATE customers SET password = '{new_hash}' WHERE username = '{user}'")
                            mydb.commit()
                            print("Password reset successfully!")
                            break
                        else:
                            print("Passwords do not match. Try again!")
                    else:
                        print("Wrong current password. Try again!")
 

            elif facility == 8:
                print("\nThank you for using FinVault services!\n")
                status = False
                break
        else:
            print("\nPlease enter valid input, from the options.\n")

    except ValueError:
        print("\nInvalid Input. Please try again using given options only!\n")