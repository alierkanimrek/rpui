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
        self._task = None
        self._profiles = None
        self._views = None




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

            self._tasks = self._db.tasks
            self._tasks.create_index([("uri", 1)])
            self._tasks.create_index([("uname", 1)])
            self._tasks.create_index([("nname", 1)])

            self._profiles = self._db.profiles
            self._profiles.create_index([("uname", 1)])

            self._views = self._db.views
            self._views.create_index([("uname", 1)])




    async def getUser(self, uid=None, uname=None, email=None):
        rec = None
        if(uname):
            rec = await self._users.find_one({'uname': uname})
        elif(email):
            rec = await self._users.find_one({'email': email})
        return(rec)




    async def createUser(self, uname, email, passw, ccode):
        rec = {
            "uname" : uname,
            "email" : email,
            "passw" : passw,
            "ccode" : ccode
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
        result = await self._auth.find_one_and_replace({"uname": data["uname"]}, data)
        if(result):            return(result["_id"])
        else:
            result = await self._auth.insert_one(data)
            if(result):            return(result.inserted_id)
            else:   return(False)





    async def getSession(self, selector):
        data = await self._auth.find_one({"_id" : ObjectId(selector)})
        if(data):   return(data)
        else:   return(False)




    async def getSessionCode(self, code):
        data = await self._auth.find_one({"code" : code})
        if(data):   return(data)
        else:   return(False)




    async def getSessionUname(self, uname):
        data = await self._auth.find_one({"uname" : uname})
        if(data):   return(data)
        else:   return(False)




    async def removeSession(self, selector):
        result = await self._auth.delete_many({"_id" : ObjectId(selector)})
        if(result):   return(True)
        else:   return(False)




    async def updateSession(self, data):
        result = await self._auth.find_one_and_replace({"uname":data["uname"]}, data)
        if(result):
            return(True)
        else:
            return(None)




    async def createUProfile(self, profile):
        result = await self._profiles.insert_one(profile)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def createNode(self, node):
        result = await self._nodes.insert_one(node)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def getUserProfile(self, uname):
        data = await self._profiles.find_one({"uname" : uname})
        del data["_id"]
        if(data):   return(data)
        else:   return(False)




    async def updateUProfile(self, doc):
        result = await self._profiles.find_one_and_replace({
            "uname":doc["uname"]}, doc)
        if(result):
            return(True)
        else:
            return(None)




    async def getUserNodes(self, uname):
        cursor = self._nodes.find({"uname": uname})
        r = await cursor.to_list(None)
        result = []
        if(type(r) is list):
            for t in r:
                del t["_id"]
                result.append(t)
        return(result)



    async def getUserNode(self, uname, nname):
        data = await self._nodes.find_one({"uname" : uname, "nname" : nname})
        del data["_id"]
        if(data):   return(data)
        else:   return(False)




    async def updateNode(self, doc):
        result = await self._nodes.find_one_and_replace({
            "uname":doc["uname"], "nname":doc["nname"]}, doc)
        if(result):
            return(True)
        else:
            return(None)




    async def removeNode(self, uname, nname):
        result = await self._nodes.delete_many({"uname": uname, "nname": nname})
        if(result):   return(True)
        else:   return(False)



    async def getTasks(self, uname, nname=False):
        if(nname):  cursor = self._tasks.find({"uname": uname, "nname": nname})
        else:   cursor = self._tasks.find({"uname": uname})
        r = await cursor.to_list(None)
        result = []
        if(type(r) is list):
            for t in r:
                del t["_id"]
                del t["data"]
                del t["last"]
                result.append(t)
            return(result)
        else:
            return(None)



    async def createTask(self, task):
        result = await self._tasks.insert_one(task)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def removeTask(self, uname, nname, tname):
        result = await self._tasks.delete_many({"uname": uname, "nname": nname, "tname": tname})
        if(result):   return(True)
        else:   return(False)




    async def updateTaskData(self, uri, data):
        result = await self._tasks.find_one_and_update({"uri":uri}, {"$set" : {"data": data}})
        if(result):
            return(True)
        else:
            return(None)




    async def createView(self, view):
        result = await self._views.insert_one(view)
        if(result):
            return(result.inserted_id)
        else:
            return(None)




    async def getUserViews(self, uname):
        cursor = self._views.find({"uname": uname})
        r = await cursor.to_list(None)
        result = []
        if(type(r) is list):
            for t in r:
                del t["_id"]
                result.append(t)
        return(result)




    async def updateView(self, view):
        result = await self._views.find_one_and_replace({
            "uname":view["uname"], "vname":view["vname"]}, view)
        if(result):
            return(True)
        else:
            return(None)




    async def getUserView(self, uname, vname):
        data = await self._views.find_one({"uname" : uname, "vname" : vname})
        del data["_id"]
        if(data):   return(data)
        else:   return(False)
