#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    This file is part of Rplexus Server Application.

    Rplexus Server Application is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Rplexus Server Application is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Rplexus Server Application.  If not, see <https://www.gnu.org/licenses/>.



    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''








import random
import datetime
import tornado

from .base import BaseHandler
from lib.store import Node, TaskData, Data, FollowupData
from lib.source import get_names_from_uri











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
                if(node):
                    followup = FollowupData()
                    for uri in node["followup"]:
                        uname2, nname, tname = get_names_from_uri(uri)
                        self.touch.add(uname2+"/"+nname)
                        followup.add(uri)
                    self.cmdFollowup(followup.data)
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
            if(not resp["awake"]):
                for uri in followup:
                    uname2, nname, tname = get_names_from_uri(uri)
                    self.touch.add(uname2+"/"+nname)
                    if(not resp["awake"]):
                        if(self.alive.isThere(uname2+"/"+nname)):
                            self.__log.d("A following is online", self.uri, uname2+"/"+nname)
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
            
            self.alive.add(self.uri)

            #Save Data
            for d in self.cstack.stack:
                if(d["name"] != "command"):
                    taskdata = d["data"]
                        
            data = await self.db.updateData(uname, nname, taskdata)
            
            if(data):
                #Get Followup data
                fup = await self.db.getFollowData(uname, data["followup"])
                self.cmdFollowup(fup)
                #Check my followings is alive
                for uri in data["followup"]:
                    uname2, nname, tname = get_names_from_uri(uri)
                    self.touch.add(uname2+"/"+nname)
                    if(not resp["awake"]):
                        if(self.alive.isThere(uname2+"/"+nname)):
                            resp["awake"] = True

            #Check owner is online
            if(self.alive.isThere(uname)):
                resp["awake"] = True

            #Check some nodes needs you
            if(not resp["awake"]):
                if(self.touch.isThere(self.uri)):
                    resp["awake"] = True                
                        
            if(not resp["awake"]):
                self.__log.d("Node going to sleep", self.uri)
            
            resp["result"] = True
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrclientupdate")

