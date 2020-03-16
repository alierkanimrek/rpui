#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    The MIT License:

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''







import argon2
import hashlib
import binascii
import base64
import random








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




    def hash(self, password, key):
        dk = hashlib.pbkdf2_hmac(
            hash_name='sha384',  
            password=password.encode(), 
            salt=key.encode(),
            iterations=100000)
        return(dk.hex())




















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
