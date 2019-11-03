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









class XHRNodeLoad(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRNodeLoad")
        resp = {"result" : False}
        
        try:
            nname = self.cstack.stack[0]["data"]["nname"]
            node_doc = await self.db.getNode(uname=self.current_user, nname=nname)
            del node_doc["_id"]
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
                
                # Create node
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
                resp = tasklist
            else:
                self.__log.e("Tasks not found", self.current_user, nname)

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)

        await self.stackAppendAndSend(resp, "xhrnodetasks")




