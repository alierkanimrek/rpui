#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''







import random
import datetime
import tornado

from .base import BaseHandler
from lib.store import Node











class XHRClientAuth(BaseHandler):


    
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRClientAuth")
        resp = {"result" : False}
        try:
            uname = self.cstack.stack[0]["uname"]
            nname = self.cstack.stack[0]["nname"]
            uri = uname+"/"+nname
            ccode = self.cstack.stack[0]["data"]["code"]
            tasklist = []
            rec = await self.db.getUser(uname=uname)
            if(rec["ccode"] == ccode):
                self.__log.i("Node logged in", uname, nname)
                await self.session.createSession(uname+"/"+nname, True)
                tasks = await self.db.getTasks(uname, nname)
                node = await self.db.getNode(uname, nname)
                if(tasks):  self.cmdTasklist(tasks)
                if(node):  self.cmdFollowup(node["followup"])
                for nn in node["followup"]:
                    self.touch.add(nn)
                resp = {"result" : True}
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
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
            uri = uname+"/"+nname
            followup = self.cstack.data(uri+"/command")["followup"]
            #Check owner is online
            if(self.alive.isThere(uname)):
                self.__log.d("Owner is online")
                resp["awake"] = True

            #Check some nodes needs you
            elif(self.touch.isThere(uri)):
                self.__log.d("Nodes needs you")
                resp["awake"] = True                
            
            #Check my followings is alive
            for nn in followup:
                self.touch.add(nn)
                if(self.alive.isThere(nn)):
                    self.__log.d("A following is online")
                    resp["awake"] = True

            resp["result"] = True
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
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
            uri = uname+"/"+nname
            followup = self.cstack.data(uri+"/command")["followup"]
            
            self.alive.add(uri)

            #Check owner is online
            if(self.alive.isThere(uname)):
                self.__log.d("Owner is online")
                resp["awake"] = True

            #Check some nodes needs you
            elif(self.touch.isThere(uri)):
                self.__log.d("Nodes needs you")
                resp["awake"] = True                
            
            #Check my followings is alive
            for nn in followup:
                self.touch.add(nn)
                if(self.alive.isThere(nn)):
                    self.__log.d("A following is online")
                    resp["awake"] = True

            resp["result"] = True
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        await self.stackAppendAndSend(resp, "xhrclientupdate")

