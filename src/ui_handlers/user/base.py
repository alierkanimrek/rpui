#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import json
import time
import tornado

from lib.msg import *
from lib.passlock import *








class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.db = self.settings['db']
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.t = int(time.time())
        self.__log = self.log.job("UBase")
        #self.uid = ""
        self.stack = Stack()
        self.cstack = Stack()
        #self.alive = self.settings['alive']
        #self.owners = self.settings['owners']
        #self.coms = self.settings["coms"]
        #self.source = {
        #    "uname": self.conf["SERVER"]["server_name"], 
        #    "nname": self.conf["SERVER"]["server_node"], 
        #    "name": "",
        #    "id": ""}




    def prepare(self):
        if(self.request.method=="POST"):
            if( not self.parseMsg()):
                self.finish()






    def parseMsg(self):
        try:
            stack = tornado.escape.json_decode(self.request.body)
        except:
            self.__log.e("Message not parsed : "+str(self.request.body)[:20]+"...")
            return(False)
        try:
            self.cstack.load(stack["stack"])
            self.__log.d(self.cstack.stack)
            return(True)
        except:
            pass
        try:
            self.cstack.append({
                "uname": "", 
                "nname" : "",
                "name": "",
                "id": ""}, 
                stack)
            return(True)
        except:
            self.__log.e("Message not parsed : "+str(self.request.body)[:20]+"...")
            return(False)


    

    def get_current_user(self):
        if self.get_secure_cookie("user"):
            uname = tornado.escape.xhtml_escape(self.get_secure_cookie("user"))
            #self.owners.add(uname, self.t)
            return(uname)
        else:
            return(None)




    async def render_page(self):
        try:
            #if self.current_user:
                #db["uname"] = self.current_user
            await self.render("user.html",
                xsrf_value = self.xsrf_token)
        except Exception as inst:
            self.__log.e("Render error", str(inst.args))



    
    def stackAppend(self, data, name="user"):
        self.stack.append({
            "uname": "root", 
            "nname" : "server",
            "name": name,
            "id": ""}, 
            data)




    def getMsg(self):
        msg = Message( uname="root", nname="server", stack=self.stack)
        return(msg.json())




    async def stackAppendAndSend(self, data, name=None):
        self.stackAppend(data, name)
        self.write(self.getMsg())




    async def createSession(self, uname, persistent=False):
        '''
            Session policy

            data["selector"] = auth db id, set as cookie
            validator = random string, set as cookie
            data["hashedValidator"] = hashed validator, stored to auth db
            data["uname"] = user name, stored to auth db            
            data["expires"] = timestamp value of expires, stored to auth db
        '''
        #Create sessin data and save it
        data = getSessionData(persistent)
        data["uname"] = uname
        validator = data["validator"]
        del data["validator"]
        selector = await self.db.createSession(data)
        if(selector):
            #Set session to browser
            await self.setSession(uname, selector, validator, persistent)




    async def checkSession(self, uname, selector, validator):
        #Get cookies
        user = self.get_secure_cookie("user")
        selector = self.get_secure_cookie("selector")
        validator = self.get_secure_cookie("validator")
        if(user and selector and validator):
            #Get auth data and check it
            data = await self.db.getSession(selector, user)
            if(checkSessionData(validator, data["hashedValidator"], data["expires"])):
                return(True)
            else:
                self.__log.d("Session invalid or expired")
                return(False)                




    async def setSession(self, uname, selector, validator, persistent=False):
        if(persistent):
            self.set_secure_cookie("selector", str(selector), expires_days=30)
            self.set_secure_cookie("validator", str(validator), expires_days=30)
            self.set_secure_cookie("user", str(uname), expires_days=30)
        else:
            self.set_secure_cookie("selector", str(selector), expires_days=None)
            self.set_secure_cookie("validator", str(validator), expires_days=None)
            self.set_secure_cookie("user", str(uname), expires_days=None)