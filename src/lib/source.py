#!/usr/bin/python
# -*- coding: utf-8 -*-


''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import hashlib








def get_uri(uname, nname, name):
    return(uname+"/"+nname+"/"+name)








def get_names_from_uri(uri):
    if uri[0] == "/":
        return(uri[1:].split("/"))
    else:
        return(uri.split("/"))








def hash_codes( code1, code2):
    if type(code1) != type(str()):
        code1 = code1.decode()
    if type(code2) != type(str()):
        code2 = code2.decode()
    return( hashlib.sha224(bytes.fromhex(code1+code2)).hexdigest() ) 
