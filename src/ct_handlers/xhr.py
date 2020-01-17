#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''







import random
import datetime
import tornado

from .base import BaseHandler
from lib.store import Node, TaskData, Data












class XHRClientAuth(BaseHandler):


    
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRClientAuth")
        resp = {"result" : False}
        try:
            uname = self.cstack.stack[0]["uname"]
            nname = self.cstack.stack[0]["nname"]
            self.uri = uname+"/"+nname
            ccode = self.cstack.stack[0]["data"]["code"]
            tasklist = []
            rec = await self.db.getUser(uname=uname)
            if(rec["ccode"] == ccode):
                self.__log.i("Node logged in", self.uri)
                await self.session.createSession(self.uri, True)
                tasks = await self.db.getTasks(uname, nname)
                node = await self.db.getNode(uname, nname)
                if(tasks):  self.cmdTasklist(tasks)
                if(node):  self.cmdFollowup(node["followup"])
                for nn in node["followup"]:
                    self.touch.add(nn)
                resp = {"result" : True}
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrclientauth")








class XHRClientPing(BaseHandler):


    
    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRClientPing")
        resp = {"result" : False, "awake": False}
        try:
            uname = self.cstack.stack[0]["uname"]
            nname = self.cstack.stack[0]["nname"]
            self.uri = uname+"/"+nname
            followup = self.cstack.data(self.uri+"/command")["followup"]
            #Check owner is online
            if(self.alive.isThere(uname)):
                self.__log.d("Owner is online", self.uri)
                resp["awake"] = True

            #Check some nodes needs you
            if(not resp["awake"]):
                if(self.touch.isThere(self.uri)):
                    self.__log.d("Nodes needs you", self.uri)
                    resp["awake"] = True                
            
            #Check my followings is alive
            for nn in followup:
                self.touch.add(nn)
                if(not resp["awake"]):
                    if(self.alive.isThere(nn)):
                        self.__log.d("A following is online", self.uri, nn)
                        resp["awake"] = True

            resp["result"] = True
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrclientping")








class XHRClientUpdate(BaseHandler):


    
    @tornado.web.authenticated
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRClientUpdate")
        resp = {"result" : False, "awake": False}
        try:
            uname = self.cstack.stack[0]["uname"]
            nname = self.cstack.stack[0]["nname"]
            taskdata = {}
            self.uri = uname+"/"+nname
            followup = self.cstack.data(self.uri+"/command")["followup"]
            
            self.alive.add(self.uri)

            #Save Data
            for d in self.cstack.stack:
                if(d["name"] != "command"):
                    taskdata = d["data"]
                        
            data = await self.db.updateData(uname, nname, taskdata)
            if(data):
                print(data["followup"])

            #Check owner is online
            if(self.alive.isThere(uname)):
                resp["awake"] = True

            #Check some nodes needs you
            if(not resp["awake"]):
                if(self.touch.isThere(self.uri)):
                    resp["awake"] = True                
            
            #Check my followings is alive
            for nn in followup:
                self.touch.add(nn)
                if(not resp["awake"]):
                    if(self.alive.isThere(nn)):
                        resp["awake"] = True
            
            if(not resp["awake"]):
                self.__log.d("Node going to sleep", self.uri)
            
            resp["result"] = True
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrclientupdate")

