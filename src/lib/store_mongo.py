#!/usr/bin/python
# -*- coding: utf-8 -*-





import time
from bson.objectid import ObjectId
import functools
import tornado
import motor











class RpMongoClient(object):




    def __init__(self):
        self._client = None
        self._uri = None
        self._db = None
        self._users = None
        self._auth = None




    def connect(self, ip, uname, passw, port=27017, callback=None):
        self._uri = "mongodb://{}:{}@{}:{}/rplexus".format(uname, passw, ip, port)
        self._client = motor.MotorClient(self._uri, connectTimeoutMS=1000)
        self._db = self._client.rplexus
        if(callback):
            f = self._client.server_info()
            f.add_done_callback(self._createCollections)
            f.add_done_callback(callback)




    def _createCollections(self, f):
        if(not f.exception()):
            self._users = self._db.users
            self._users.create_index([("uname", 1), ("email", 1)])
            
            self._auth = self._db.auth
            self._auth.create_index([("uname", 1)])

            self._nodes = self._db.nodes
            self._nodes.create_index([("nname", 1)])
            self._nodes.create_index([("uname", 1)])



    async def getUser(self, uid=None, uname=None, email=None):
        rec = None
        if(uname):
            rec = await self._users.find_one({'uname': uname})
        elif(email):
            rec = await self._users.find_one({'email': email})
        return(rec)




    async def createUser(self, uname, email, passw):
        rec = {
            "uname" : uname,
            "email" : email,
            "passw" : passw
        }
        result = await self._users.insert_one(rec)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def updateUser(self, rec, passw):
        rec["passw"] = passw
        id = rec["_id"]
        del rec["_id"]

        #result = await self._users.find_one_and_update({"_id":id}, {"$set" : {"passw": rec["passw"]}})
        result = await self._users.find_one_and_replace({"_id":id}, rec)
        if(result):
            return(True)
        else:
            return(None)



    async def createSession(self, data):
        result = await self._auth.insert_one(data)
        if(result):            return(result.inserted_id)
        else:            return(None)




    async def getSession(self, selector):
        data = await self._auth.find_one({"_id" : ObjectId(selector)})
        if(data):   return(data)
        else:   return(False)




    async def getSessionCode(self, code):
        data = await self._auth.find_one({"code" : code})
        if(data):   return(data)
        else:   return(False)




    async def removeSession(self, selector):
        result = await self._auth.delete_many({"_id" : ObjectId(selector)})
        if(result):   return(True)
        else:   return(False)




    async def createNode(self, node):
        result = await self._nodes.insert_one(node)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def getUserNodes(self, uname):
        cursor = self._nodes.find({"uname": uname})
        result = await cursor.to_list()
        if(result):
            return(result)
        else:
            return(None)



    async def getUserNode(self, uname, nname):
        data = await self._nodes.find_one({"uname" : uname, "nname" : nname})
        if(data):   return(data)
        else:   return(False)
