#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''



import tornado 

from .base import BaseHandler













class XHRUGroup(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        self.__log = self.log.job("XHRUGrp")
        resp = {"result" : False}
        try:
            if("uname" in self.cstack.stack[0]["data"]):
                user = await self.db.getUser(uname=self.cstack.stack[0]["data"]["uname"])
            else:
                user = await self.db.getUser(uname=self.current_user)
            if(user):
                resp = {"groups": user["ugroup"].split(" "), "result" : True}
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrugrp")






class XHRUpUGroup(BaseHandler):


    @tornado.web.authenticated
    async def post(self):

        self.__log = self.log.job("XHRUpUGroup")
        resp = {"result" : False}
        
        try:
            uname = self.cstack.stack[0]["data"]["uname"]
            ad = self.cstack.stack[0]["data"]["ad"]
            md = self.cstack.stack[0]["data"]["md"]
            ts = self.cstack.stack[0]["data"]["ts"]
            ugroups = ""
            if(ad): ugroups = "ad"
            if(md): ugroups += " md"
            if(ts): ugroups += " ts"
            # Update groups
            result = await self.db.updateUGroups(uname, ugroups)
            if(result):
                resp = {"result" : True}
            else:
                self.__log.w("Groups not updated", uname)

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrupdateugrp")
