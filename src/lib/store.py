#!/usr/bin/python
# -*- coding: utf-8 -*-





import time
from bson.objectid import ObjectId

import tornado
import motor

from .passlock import PasswordLock
from .store_mongo import RpMongoClient








class Store(object):
    




    def __init__(self):
        self._db = RpMongoClient()   





    def connect(self, ip, uname, passw, port=27017, callback=None):
        self._db.connect(ip, uname, passw, port, callback)




    async def getUser(self, uid=None, uname=None, email=None):
        rec = await self._db.getUser(uid, uname, email)
        return(rec)




    async def createUser(self, data, passwKey):
        p = PasswordLock()
        chiper = p.hashAndEncrypt(data["passw"], passwKey)
        id = await self._db.createUser(data["uname"], data["email"], chiper)
        if(id):            return(True)
        else:            return(False)




    async def createSession(self, data):
        id = await self._db.createSession(data)
        if(id):            return(str(id))
        else:            return(False)




    async def getSession(self, selector, uname):
        data = await self._db.getSession(selector)
        if(data and data["uname"] == uname):
            return(data)
        else:
            return(False)




    async def removeSession(self, selector):
        return(await self._db.removeSession(selector))
