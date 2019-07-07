#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''





from .base import BaseHandler







class XHRCheckHandler(BaseHandler):
    



    
    async def post(self):
        #'data': {'type': 'email|uname', 'data': '...'}
        self.__log = self.log.job("XHRCheck")
        try:
            data = self.cstack.stack[0]["data"]
            if(data["type"] == "email"):
                user = await self.db.getUser(email=data["data"])
            elif(data["type"] == "uname"):
                user = await self.db.getUser(uname=data["data"])
            if(user):
                resp = {"result" : True}
            else:
                resp = {"result" : False}
            await self.stackAppendAndSend(resp, "xhrcheck")
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
