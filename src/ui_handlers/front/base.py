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








import json
import time
import tornado
import datetime

from lib.msg import *
from lib.passlock import *
from lib.session import SessionManager








class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.db = self.settings['db']
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.t = int(time.time())
        self.__log = self.log.job("FBase")
        self.session = SessionManager(self)
        self.stack = Stack()
        self.cstack = Stack()
        self.alive = self.settings['alive']
        self.touch = self.settings['touch']
        self.cmd = self.settings["cmd"]




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
            self.alive.add(uname)
            return(uname)
        else:
            return(None)




    async def render_page(self):
        try:
            #if self.current_user:
                #db["uname"] = self.current_user
            await self.render("front.html",
                xsrf_value = self.xsrf_token)
        except Exception as inst:
            self.__log.e("Render error", str(inst.args))



    
    def stackAppend(self, data, name="front"):
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



