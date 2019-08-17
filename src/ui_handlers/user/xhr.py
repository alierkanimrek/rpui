#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''



import random
import datetime
import tornado 

from .base import BaseHandler
from lib.passlock import PasswordLock
from lib.session import getSessionData







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








class XHRSessionUpdate(BaseHandler):



    
    async def post(self):
        await self.session.updateSession()








class XHRUserForgotPassw(BaseHandler):




    async def post(self):
        #data = {"email": ...}
        self.__log = self.log.job("XHRUForgotPassw")
        resp = {"result" : False}

        try:
            data = self.cstack.stack[0]["data"]
            #Get user
            user = await self.db.getUser(email=data["email"])
            if(user):

                self.__log.i("User request recovery code", data["email"])

                #Code will be save at session db as session data
                #But uname variable will be contain email 

                #Generate code
                code = ""
                for x in range(5): 
                    code += str(random.randint(0, 9))

                #Prepare Session Data
                codeData = getSessionData()
                codeData["uname"] = data["email"]
                codeData["code"] = code

                selector = await self.db.createSession(codeData)
                if(selector):
                    #Send code to user email
                    self.__log.d("Sending recovery code to email", data["email"])
                    
                    # ...
                    
                    resp = {"result" : True}

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)

        await self.stackAppendAndSend(resp, "xhruforgot")







class XHRUserSendCode(BaseHandler):




    async def post(self):
        #data = {"email": ...., "code": ...}
        self.__log = self.log.job("XHRUSendCode")
        resp = {"result" : False}

        try:
            data = self.cstack.stack[0]["data"]
            
            #Get code
            codeData = await self.db.getSessionCode(data["code"], data["email"])
            
            if(codeData):

                #Check expires
                diff = int(codeData["expires"]) - datetime.datetime.now().timestamp()
                if(diff > 0):

                    user = await self.db.getUser(email=data["email"])

                    if(user):
                        await self.session.createSession(user["uname"])
                        self.__log.i("User getting password recovery", user["uname"])
                        resp = {"result" : True}
                
                await self.db.removeSession(str(codeData["_id"]))

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)

        await self.stackAppendAndSend(resp, "xhrsendcode")







class XHRUserChangePassw(BaseHandler):
    



    @tornado.web.authenticated
    async def post(self):
        #data = {"passw":...}
        self.__log = self.log.job("XHRUChangePassw")
        resp = {"result" : False}
        
        # Check again
        try:
            data = self.cstack.stack[0]["data"]
            user_doc = await self.db.getUser(uname=self.current_user)
            if(user_doc and len(data["passw"]) > 7):
                
                # Change Password
                result = await self.db.changeUserPassw(data["passw"], self.conf.SERVER.pass_key, doc=user_doc)
                if(result):
                    self.__log.i("User password changed", self.current_user)
                    await self.session.endSession()
                    resp = {"result" : True}
                else:
                    self.__log.w("Password change error", self.current_user)
            else:
                self.__log.w("User not found or password invalid", self.current_user)

        except Exception as inst:
            self.__log.e("Runtime error", type(inst), inst.args)
        
        await self.stackAppendAndSend(resp, "xhruchangepassw")
        