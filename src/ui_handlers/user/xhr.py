#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''





from .base import BaseHandler
from lib.passlock import PasswordLock







class XHRUserCheckHandler(BaseHandler):
    



    
    async def post(self):
        #'data': {'type': 'email|uname', 'data': '...'}
        self.__log = self.log.job("XHRUCheck")
        try:
            data = self.cstack.stack[0]["data"]
            if(data["type"] == "email"):
                user = await self.db.getUser(email=data["data"])
            elif(data["type"] == "uname"):
                if(not data["data"] in self.conf.SERVER.special_names.split(" ")):
                    user = await self.db.getUser(uname=data["data"])
                else:
                    user = True
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
        result = await self.db.createUser(data, self.conf.SERVER.pass_key)
        if(result):
            self.__log.i("New user recorded", data["uname"])
            await self.session.createSession(data["uname"])                
            resp = {"result" : True}
        else:
            self.__log.w("User could not recorded", data["uname"])
        
        await self.stackAppendAndSend(resp, "xhrucreate")











class XHRUserLogin(BaseHandler):
    



    
    async def post(self):
        #data = {"uname": ..., "passw":...}
        self.__log = self.log.job("XHRULogin")
        resp = {"result" : False}

        try:
            data = self.cstack.stack[0]["data"]
            #Get user
            if("@" in data["uname"]):
                user = await self.db.getUser(email=data["uname"]) 
            else:
                user = await self.db.getUser(uname=data["uname"]) 

            #Verify Password
            p = PasswordLock()
            if(p.verify(user["passw"], data["passw"], self.conf.SERVER.pass_key)):
                resp = {"result" : True}
                await self.session.createSession(user["uname"])                
                self.__log.i("User logged in", user["uname"])
            else:
                self.__log.d("Unauthorized login attempt", user["uname"])
        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhrulogin")