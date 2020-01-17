#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''



import random
import datetime
import traceback
import sys
import tornado 

from .base import BaseHandler
from lib.session import getSessionData
from lib.store import Node, View, ViewItem







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
            self.__log.e_tb("Runtime error", inst)
        
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
            self.__log.e_tb("Runtime error", inst)
        
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
            self.__log.e_tb("Runtime error", inst)
        
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
            self.__log.e_tb("Runtime error", inst)
        
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
                        self.__log.w("Node not removed", doc.nname)
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
            self.__log.e_tb("Runtime error", inst)
        
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
            self.__log.e_tb("Runtime error", inst)

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
                    tasks = await self.db.getTasks(uname, nname)
                    if(tasks):  self.cmdTasklist(uname+"/"+nname, tasks)
                else:
                    self.__log.w("Task not created", nname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
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
                    tasks = await self.db.getTasks(uname, nname)
                    if(tasks):  self.cmdTasklist(uname+"/"+nname, tasks)
                else:
                    self.__log.w("Task not removed", nname, tname)
            else:
                self.__log.e("User not found")

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrremovetask")







class XHRViewCreate(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"vname":...}
        self.__log = self.log.job("XHRViewCreate")
        resp = {"result" : False}
        
        try:
            vname = self.cstack.stack[0]["data"]["vname"]
            uname = self.current_user

            # Create node
            result = await self.db.createView(vname, uname)
            if(result):
                self.__log.i("New view created", vname)
                resp = {"result" : True}
            else:
                self.__log.w("View not created", vname)

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrcreateview")








class XHRViews(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        
        self.__log = self.log.job("XHRViews")
        resp = {"result" : False}
        
        try:
            viewlist = await self.db.getViews(uname=self.current_user)
            lst = []
            for view in viewlist:
                lst.append({"vname": view["vname"], "desc": view["desc"]})
            resp = {"viewlist": lst}

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrviews")








class XHRNodeVars(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        
        self.__log = self.log.job("XHRNodeVars")
        resp = {"result" : False}
        
        try:
            tasklist = await self.db.getTasks(uname=self.current_user)
            lst = []
            for task in tasklist:
                lst.append(task["nname"]+"/"+task["tname"])
            resp = {"nodevars": lst}

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrnodevars")
 







class XHRViewUpdate(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"vname":...}
        self.__log = self.log.job("XHRViewUpdate")
        resp = {"result" : False}
        
        try:
            view = View(self.cstack.stack[0]["data"]["vname"], self.current_user)
            for item in self.cstack.stack[0]["data"]["items"]:
                vi = ViewItem(
                    item["title"],
                    item["order"], 
                    item["widget"], 
                    item["editable"], 
                    item["autosend"], 
                    item["map"], 
                    item["static"])
                view.items.append(vars(vi))

            # Update view
            result = await self.db.updateView( view)
            if(result):
                resp = {"result" : True}
            else:
                self.__log.w("View not updated", view["uname"], view["vname"])

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrupdateview")








class XHRView(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        
        self.__log = self.log.job("XHRView")
        resp = {"result" : False}
        
        try:

            view = await self.db.getView(
                uname=self.current_user, 
                vname=self.cstack.stack[0]["data"]["vname"])
            if(view):
                resp = {"view": view, "result": True}                

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrview")








class XHRChkData(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRChkData")
        resp = {"result" : False}
        
        try:
            uname = self.current_user
            cmds = self.cstack.stack[0]["data"]
            self.cmdUser(cmds)                
            
            data = await self.db.getUserData(uname)
            if(data):
                resp = {"result" : True}
                for d in data:
                    resp[d["nname"]] = d["taskdata"]

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrchkdata")
