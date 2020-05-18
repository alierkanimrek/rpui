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
from lib.passlock import PasswordLock
from lib.session import getSessionData
from lib.store import UserProfile
from lib.mail import sendMail
from .mail import clientCodeMail, userCodeMail
from .oauth import GoogleOAuth2







class XHRSignupCheckHandler(BaseHandler):
    



    
    async def post(self):
        #'data': {}
        self.__log = self.log.job("XHRSignupCheck")
        try:
            if(self.conf.USERS.signup == "yes"):
                resp = {"result" : True}
            else:
                resp = {"result" : False}
            await self.stackAppendAndSend(resp, "xhrsignupcheck")
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)








class XHRUserCheckHandler(BaseHandler):
    



    
    async def post(self):
        #'data': {'type': 'email|uname', 'data': '...'}
        self.__log = self.log.job("XHRUCheck")
        try:
            data = self.cstack.stack[0]["data"]
            if(data["type"] == "email"):
                user = await self.db.getUser(email=data["data"])
            elif(data["type"] == "uname"):
                if(not data["data"] in self.conf.USERS.banned_names.split(",")):
                    user = await self.db.getUser(uname=data["data"])
                else:
                    user = True
            if(user):
                resp = {"result" : True}
            else:
                resp = {"result" : False}
            await self.stackAppendAndSend(resp, "xhrucheck")
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)









class XHRUserCreateHandler(BaseHandler):
    



    
    async def post(self):
        #data = {"uname": ..., "email":..., "passw":...}
        self.__log = self.log.job("XHRUCreate")
        resp = {"result" : False}
        invited = False
        try:
            data = self.cstack.stack[0]["data"]

            if(data["gAuthToken"]):
                gauth = GoogleOAuth2()
                inst, email, passw = gauth.check(data["gAuthToken"])
                if(inst):
                    self.__log.d("Auth error", inst, data["uname"])
                else:
                    data["email"] = email
                    data["passw"] = passw
            # Check again
            if(await self.db.getUser(email=data["email"]) or 
                await self.db.getUser(uname=data["uname"]) or 
                len(data["passw"]) < 8):
                self.__log.w("User has or password invalid", data["email"], data["uname"])
            else:
                # Check invited user
                if(self.conf.USERS.signup == "no"):
                    invited = await self.db.isInvited(data["email"])
                    if(invited):
                        self.__log.i("Invited user recording", data["email"], data["uname"])
                # Create User
                if(self.conf.USERS.signup == "yes" or invited):
                    result = await self.db.createUser(data, self.conf.SERVER.pass_key)
                    if(result):
                        result = await self.db.createUProfile(data["uname"])
                        if(not result):
                            self.__log.w("User profile not recorded", data["uname"])
                        self.__log.i("New user recorded", data["uname"])
                        await self.session.createSession(data["uname"])                
                        resp = {"result" : True}
                    else:
                        self.__log.e("User could not recorded", data["uname"])
                
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)

        await self.stackAppendAndSend(resp, "xhrucreate")











class XHRUserLogin(BaseHandler):
    



    
    async def post(self):
        #data = {"uname": ..., "passw":...}
        self.__log = self.log.job("XHRULogin")
        resp = {"result" : False}

        try:
            data = self.cstack.stack[0]["data"]

            if(data["gAuthToken"]):
                gauth = GoogleOAuth2()
                inst, email, passw = gauth.check(data["gAuthToken"])
                if(inst):
                    self.__log.d("Auth error", inst)
                else:
                    data["uname"] = email

            #Get user
            if("@" in data["uname"]):
                user = await self.db.getUser(email=data["uname"]) 
            else:
                user = await self.db.getUser(uname=data["uname"]) 
            
            if(data["gAuthToken"]):
                if(user):
                    resp = {"result" : True}
                    await self.session.createSession(user["uname"], data["remember"])  
                    self.__log.i("User logged in", user["uname"])
                else:
                    self.__log.d("Unauthorized login attempt", data["uname"])                            
            else:    
                #Verify Password
                p = PasswordLock()
                if(user and p.verify(user["passw"], data["passw"], self.conf.SERVER.pass_key)):
                    resp = {"result" : True}
                    await self.session.createSession(user["uname"], data["remember"])  
                    self.__log.i("User logged in", user["uname"])
                else:
                    self.__log.d("Unauthorized login attempt", data["uname"])

            #Root user creation
            if(not user and data["uname"] == "root"):
                self.__log.i("Root user creation")
                root = {"uname": "root", "email": "root@rplexus.net", "passw":""}
                rootuser = await self.db.createUser(root, self.conf.SERVER.pass_key)
                if(rootuser):
                    rootgrp = await self.db.updateUGroups(root["uname"], "rt")
                    rootprof = await self.db.createUProfile(root["uname"])

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrulogin")





class XHRSessionUpdate(BaseHandler):



    
    async def post(self):
        try:
            await self.session.checkSession()
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)









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
                    msg = userCodeMail("en-us", user["uname"],  user["email"], codeData["code"])
                    send = await sendMail(self.conf.SERVER.outgoing_path, data["email"], msg)
                    resp = {"result" : True}

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)

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
            self.__log.e_tb("Runtime error", inst)

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
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhruchangepassw")









class XHRGetCurrentUser(BaseHandler):
    



    @tornado.web.authenticated
    async def post(self):
        '''
            data = {"all":...} or {}
                {} returns only uname
        '''
        self.__log = self.log.job("XHRGetUser")
        resp = {"result" : False}
        try:
            data = self.cstack.stack[0]["data"]
            if("all" in data):
                resp = await self.db.getUser(uname=self.current_user)
                del resp["_id"]
                del resp["passw"]
                del resp["ccode"]
            else:
                resp["uname"] = self.current_user
            resp["result"] = True
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)

        await self.stackAppendAndSend(resp, "xhrgetuname")








class XHRGetUserProfile(BaseHandler):
    



    @tornado.web.authenticated
    async def post(self):

        self.__log = self.log.job("XHRGetUserProfile")
        resp = {"result" : False}
        try:
            data = await self.db.getUProfile(self.current_user)
            if(data):
                resp["uname"] = self.current_user
                resp = data
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)

        await self.stackAppendAndSend(resp, "xhrgetuprf")        








class XHRUpdateUserProfile(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        #data = {"title":...}
        self.__log = self.log.job("XHRUpdateUProfile")
        resp = {"result" : False}
        rec = UserProfile(self.current_user)
        try:
            rec.firstname = self.cstack.stack[0]["data"]["firstname"]
            rec.lastname = self.cstack.stack[0]["data"]["lastname"]
            rec.about = self.cstack.stack[0]["data"]["about"]

            if(rec.firstname == "remove"):
                # Remove Node
                """result = await self.db.removeNode(uname, doc.nname)
                if(result):
                    self.__log.i("Node removed", doc.nname)
                    resp = {"result" : True}
                else:
                    self.__log.w("Node not removed", nname)"""
                pass
            else:
                # Update node
                result = await self.db.updateUProfile(rec)
                if(result):
                    self.__log.i("Profile updated", rec.uname)
                    resp = {"result" : True}
                else:
                    self.__log.w("Profile not updated", rec.uname)

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrupdateuprf")







class XHRSendClientCode(BaseHandler):




    @tornado.web.authenticated
    async def post(self):
        #data = {}
        self.__log = self.log.job("XHRUSendCC")
        resp = {"result" : False}

        try:
            user = await self.db.getUser(uname=self.current_user)
            if(user):
                ccmail = clientCodeMail("en-us", self.current_user, user["email"], user["ccode"])
                result = await sendMail(self.conf.SERVER.outgoing_path, user["email"], ccmail )
                if(result): 
                    resp = {"result" : True}
                    self.__log.d("Mail message saved", self.current_user)
                else:
                    self.__log.e("Mail message not saved", self.current_user)
                
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)

        await self.stackAppendAndSend(resp, "xhrsendcc")
