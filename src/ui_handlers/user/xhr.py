#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''





from .base import BaseHandler







class XHRUserCheckHandler(BaseHandler):
    



    
    async def post(self):
        #'data': {'type': 'email|uname', 'data': '...'}
        self.__log = self.log.job("XHRUCheck")
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
            await self.stackAppendAndSend(resp, "xhrucheck")
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)









class XHRUserCreateHandler(BaseHandler):
    



    
    async def post(self):
        #data = {"uname": ..., "email":..., "passw":...}
        self.__log = self.log.job("XHRUCreate")
        resp = {"result" : False}
        
        # Check again
        try:
            data = self.cstack.stack[0]["data"]
            if(await self.db.getUser(email=data["email"]) or 
                await self.db.getUser(uname=data["uname"]) or 
                len(data["passw"]) < 8):
                self.__log.w("User has or password invalid", data)
                await self.stackAppendAndSend(resp, "xhrucreate")        
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        # Create User
        # FIX Key, get it from config
        result = await self.db.createUser(data, "1234567812345678")
        if(result):
            self.__log.i("New user recorded", data["uname"])
            resp = {"result" : True}
        await self.createSession(data["uname"])                
        await self.stackAppendAndSend(resp, "xhrucreate")




