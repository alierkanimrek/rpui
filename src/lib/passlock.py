#!/usr/bin/python
# -*- coding: utf-8 -*-




import argon2
import hashlib
import binascii
import base64
import random
import datetime







class PasswordLock(object):
    



    def __init__(self):
        pass




    def hashAndEncrypt(self, password, key):
        dk = hashlib.pbkdf2_hmac(
            hash_name='sha384',  
            password=password.encode(), 
            salt=b'',
            iterations=100000)
        hash = binascii.hexlify(dk)
        hash = base64.b64encode(hash)
        cryp = argon2.argon2_hash(hash, key)
        return(cryp)




    def verify(self, ciphertext, password, key):
        if(self.hashAndEncrypt(password, key) == ciphertext):
            return(True)
        else:
            return(False)









def getSessionData(persistent=False, days=30, minutes=5):

    # Generate session validator
    validator = ""
    for x in range(10): 
        validator += str(random.randint(1, 101))
    validator = validator.encode()
    m = hashlib.sha256()
    m.update(validator)
    hashedValidator = m.digest()

    # session is same as DB id

    # timestamp for expires
    if(persistent):
        expires = datetime.datetime.now() + datetime.timedelta(days=days)
    else:
        expires = datetime.datetime.now() + datetime.timedelta(minutes=minutes)

    data = {
    "validator": validator,
    "hashedValidator": hashedValidator,
    "expires": expires.timestamp()}

    return(data)








def checkSessionData(validator, hashedValidator, expires):
    m = hashlib.sha256()
    m.update(validator.encode())
    hValidator = m.digest()
    if(hValidator != hashedValidator):
        return(False)
    
    diff = expires - datetime.datetime.now().timestamp()
    if(diff <= 0):
        return(False)

    return(True)







"""
test = PasswordLock()
key = "1234567812345678"
chiper = test.hashAndEncrypt("mypassword", key)
print(test.verify(chiper, "mypassword", key))
"""



"""
# Example for key replacement
# https://github.com/paragonie/password_lock/blob/master/src/PasswordLock.php

import cryptography.fernet
import argon2
import base64

def encrypt_data(data_bytes, password, salt):
    password_hash = argon2.argon2_hash(password=password, salt=salt)
    encoded_hash = base64.urlsafe_b64encode(password_hash[:32])
    encryptor = cryptography.fernet.Fernet(encoded_hash)
    return encryptor.encrypt(data_bytes)


def decrypt_data(cipher_bytes, password, salt):
    password_hash = argon2.argon2_hash(password=password, salt=salt)
    encoded_hash = base64.urlsafe_b64encode(password_hash[:32])
    decryptor = cryptography.fernet.Fernet(encoded_hash)
    return decryptor.decrypt(cipher_bytes)
"""
