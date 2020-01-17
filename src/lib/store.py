#!/usr/bin/python
# -*- coding: utf-8 -*-





import time
import random
from bson.objectid import ObjectId

import tornado
import motor

from .passlock import PasswordLock
from .store_mongo import RpMongoClient





NODEACCESS_USER = 0
NODEACCESS_GROUP = 1
NODEACCESS_ALL = 2







class Node():

    def __init__(self, nname, uname):
        self.nname = nname
        self.uname = uname
        self.desc = ""
        self.access = NODEACCESS_USER
        self.group = []
        self.followup = []




class Task():

    def __init__(self, uname, nname, tname):
        self.nname = nname
        self.uname = uname
        self.tname = tname
        self.uri = uname+"/"+nname+"/"+tname
        self.desc = ""
        #self.access = NODEACCESS_USER
        #self.group = []
        #self.data = {}
        #self.last = 0




class TaskData():

    def __init__(self, tname, data):
        self.tname = tname
        self.data = data




class Data():

    def __init__(self, uname, nname):
        self.nname = nname
        self.uname = uname
        self.taskdata = {}
        self.access = NODEACCESS_USER
        self.group = []
        self.followup = []




class UserProfile():

    def __init__(self, uname):
        self.uname = uname
        self.firstname = ""
        self.lastname = ""
        self.about = ""




class View():

    def __init__(self, vname, uname):
        self.vname = vname
        self.uname = uname
        self.desc = ""
        self.items = []




class ViewItem():

    def __init__(self, title, order, widget, editable, autosend, map, static):
        self.title = title
        self.order = order
        self.widget = widget
        self.editable = editable
        self.autosend = autosend
        self.map = map
        self.static = static










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
        ccode = str(p.hash(str(time.time()), str(random.random())))
        id = await self._db.createUser(data["uname"], data["email"], chiper, ccode)
        if(id):            return(True)
        else:            return(False)




    async def changeUserPassw(self, passw, passwKey, doc=None, uname=None):
        if(not doc and uname):
            doc = await self.getUser(uname=uname)
            if(not doc):
                return(False)
        p = PasswordLock()
        chiper = p.hashAndEncrypt(passw, passwKey)
        id = await self._db.updateUser(doc, chiper)
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




    async def updateSession(self, doc): 
        data = await self._db.updateSession(doc)
        if(data):   return(data)
        else:   return(False)




    async def getSessionCode(self, code, uname):
        data = await self._db.getSessionCode(code)
        if(data and data["uname"] == uname):
            return(data)
        else:
            return(False)




    async def removeSession(self, selector):
        return(await self._db.removeSession(selector))




    async def createUProfile(self, uname):
        prf = UserProfile(uname)
        id = await self._db.createUProfile(vars(prf))
        if(id):     return(str(id))
        else:   return(False)




    async def getUProfile(self, uname):
        data = await self._db.getUserProfile(uname)
        if(data):   return(data)
        else:   return(False)




    async def updateUProfile(self, doc): 
        #doc = UserProfile(..)
        data = await self._db.updateUProfile(vars(doc))
        if(data):   return(data)
        else:   return(False)




    async def createNode(self, nname, uname):
        node = Node(nname, uname)
        data = Data(uname, nname)
        id = await self._db.createNode(vars(node))
        idata = await self._db.createData(vars(data))
        if(id):     return(str(id))
        else:   return(False)




    async def getNode(self, uname, nname):
        data = await self._db.getUserNode(uname, nname)
        if(data):   return(data)
        else:   return(False)




    async def getNodes(self, uname):
        data = await self._db.getUserNodes(uname)
        return(data)




    async def updateNode(self, doc): 
        #doc = Node(..)
        node = await self._db.updateNode(vars(doc))
        if(node):
            data = await self._db.updateDataProps(doc.uname, doc.nname, node["access"], node["group"], node["followup"])
            if(data):
                return(node)
        return(False)




    async def removeNode(self, uname, nname):
        tasklist = await self.getTasks(uname, nname)
        if(type(tasklist) is list):
            for task in tasklist:
                await self.removeTask(uname, nname, task["tname"])
        data2 = await self._db.removeData(uname, nname)
        data = await self._db.removeNode(uname, nname)
        if(data):   return(True)
        return(False)




    async def updateData(self, uname, nname, data):
        data = await self._db.updateData(uname, nname, data)
        if(data):   return(data)
        else:   return(False)




    async def getNodeData(self, uname, nname):
        data = await self._db.getNodeData(uname, nname)
        if(data):   return(data)
        else:   return(False)




    async def getUserData(self, uname):
        data = await self._db.getUserData(uname)
        return(data)




    async def getTasks(self, uname, nname=False):
        data = await self._db.getTasks(uname, nname)
        if(data):   return(data)
        else:   return(False)



    async def createTask(self, uname, nname, tname):
        task = Task(uname, nname, tname)
        id = await self._db.createTask(vars(task))
        if(id):     return(str(id))
        else:   return(False)




    async def removeTask(self, uname, nname, tname):
        return(await self._db.removeTask(uname, nname, tname))



    async def updateTaskData(self, uri, data):
        result = await self._db.updateTaskData(uri, data)
        if(result):
            return(True)
        else:
            return(None)




    async def createView(self, vname, uname):
        view = View(vname, uname)
        id = await self._db.createView(vars(view))
        if(id):     return(str(id))
        else:   return(False)




    async def getViews(self, uname):
        data = await self._db.getUserViews(uname)
        return(data)




    async def updateView(self, view):
        result = await self._db.updateView(vars(view))
        if(result): return(True)
        else:   return(None)




    async def getView(self, uname, vname):
        data = await self._db.getUserView(uname, vname)
        return(data)
