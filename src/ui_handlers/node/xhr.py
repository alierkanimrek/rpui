#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''



import random
import datetime
import tornado 

from .base import BaseHandler
from lib.session import getSessionData
from lib.store import Node







class XHRNodeCreate(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRNodeCreate")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            user_doc = await self.db.getUser(uname=self.current_user)
            
            if(user_doc):                
                uname = user_doc["uname"]
                # Create node
                result = await self.db.createNode(nname, uname)
                if(result):
                    self.__log.i("New node created", nname)
                    resp = {"result" : True}
                else:
                    self.__log.w("Node not created", nname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrcreatenode")








class XHRNodes(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRNodes")
        resp = {"result" : False}
        
        try:
            nodelist = await self.db.getNodes(uname=self.current_user)
            lst = []
            for node in nodelist:
                lst.append({"nname": node["nname"], "desc": node["desc"]})
            resp = {"nodelist": lst}

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrnodes")








class XHRChkNodes(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRChkNodes")
        resp = {"result" : False}
        
        try:
            uname = self.current_user
            nodestatus = {}
            for nname in self.cstack.stack[0]["data"]["nodenames"]:
                uri = uname+"/"+nname
                if(self.alive.isThere(uri)):
                    nodestatus[nname] =  True
                else:
                    nodestatus[nname] =  False
            
            resp = nodestatus

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrchknodes")









class XHRNodeLoad(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRNodeLoad")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            node_doc = await self.db.getNode(uname=self.current_user, nname=nname)
            if(node_doc):                
                resp = node_doc
            else:
                self.__log.e("Node not found", self.current_user, nname)

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrnodeload")








class XHRNodeUpdate(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"title":...}
        self.__log = self.log.job("XHRNodeUpdate")
        resp = {"result" : False}
        
        try:
            user_doc = await self.db.getUser(uname=self.current_user)
            
            if(user_doc):                
                uname = user_doc["uname"]
                doc = Node(self.cstack.stack[0]["data"]["title"], uname)
                doc.desc = self.cstack.stack[0]["data"]["desc"]
                doc.access = self.cstack.stack[0]["data"]["access"]
                #doc.group = 
                #doc.tlist = 
                
                if(doc.desc == "remove"):
                    # Remove Node
                    result = await self.db.removeNode(uname, doc.nname)
                    if(result):
                        self.__log.i("Node removed", doc.nname)
                        resp = {"result" : True}
                    else:
                        self.__log.w("Node not removed", nname)
                else:
                    # Update node
                    result = await self.db.updateNode(doc)
                    if(result):
                        self.__log.i("Node updated", doc.nname)
                        resp = {"result" : True}
                    else:
                        self.__log.w("Node not updated", nname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrupdatenode")







class XHRNodeTasks(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRNodeTasks")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            tasklist = await self.db.getTasks(uname=self.current_user, nname=nname)
            if(type(tasklist) is list):                
                resp = {"result" : tasklist}
            else:
                self.__log.e("Tasks not found", self.current_user, nname)

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)

        await self.stackAppendAndSend(resp, "xhrnodetasks")








class XHRCreateTask(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRCreateTask")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            tname = self.cstack.stack[0]["data"]["tname"]
            user_doc = await self.db.getUser(uname=self.current_user)
            
            if(user_doc):                
                uname = user_doc["uname"]
                # Create node
                result = await self.db.createTask(uname, nname, tname)
                if(result):
                    self.__log.i("New task created", nname)
                    resp = {"result" : True}
                else:
                    self.__log.w("Task not created", nname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrcreatetask")








class XHRRemoveTask(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRRemoveTask")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            tname = self.cstack.stack[0]["data"]["tname"]
            user_doc = await self.db.getUser(uname=self.current_user)
            
            if(user_doc):                
                uname = user_doc["uname"]
                # Create node
                result = await self.db.removeTask(uname, nname, tname)
                if(result):
                    self.__log.i("Task removed", nname, tname)
                    resp = {"result" : True}
                else:
                    self.__log.w("Task not removed", nname, tname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrremovetask")



