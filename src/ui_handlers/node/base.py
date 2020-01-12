#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import json
import time
import tornado
import datetime

from lib.msg import *
from lib.passlock import *
from lib.session import SessionManager
from lib.source import get_names_from_uri








class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.db = self.settings['db']
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.t = int(time.time())
        self.__log = self.log.job("NBase")
        self.session = SessionManager(self)
        #self.uid = ""
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
            await self.render("node.html",
                xsrf_value = self.xsrf_token)
        except Exception as inst:
            self.__log.e("Render error", str(inst.args))




    def cmdTasklist(self, uri, tasklist):
        tasks = []
        cd = CommandData()
        for task in tasklist:
            tasks.append(task["tname"])
        cd.cmd("tasklist", tasks)
        self.cmd.add(uri, cd.data)




    def cmdUser(self, cmds):
        for key, value in cmds.items():
            names = get_names_from_uri(key)
            tname = names[2]
            node = names[0]+"/"+names[1]
            self.cmd.add(node, {tname:value})



    
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



