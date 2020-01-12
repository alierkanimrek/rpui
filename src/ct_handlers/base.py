#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import json
import time
import tornado
import datetime
from lib.session import SessionManager

from lib.msg import *









class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.db = self.settings['db']
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.t = int(time.time())
        self.__log = self.log.job("CBase")
        self.session = SessionManager(self)

        #self.uid = ""
        self.stack = Stack()
        self.cstack = Stack()
        self.alive = self.settings['alive']
        self.touch = self.settings['touch']
        self.cmd = self.settings["cmd"]
        #self.source = {
        #    "uname": self.conf["SERVER"]["server_name"], 
        #    "nname": self.conf["SERVER"]["server_node"], 
        #    "name": "",
        #    "id": ""}
        self.cmds = CommandData()
        self.uri = ""




    def check_xsrf_cookie(self):
        pass




    def prepare(self):
        if(self.request.method=="POST"):
            if( not self.parseMsg()):
                self.finish()






    def parseMsg(self):
        try:
            stack = tornado.escape.json_decode(self.request.body)
            self.cstack.load(stack["stack"])
            #self.__log.d(self.cstack.stack)
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
            await self.render("node.html",
                xsrf_value = self.xsrf_token)
        except Exception as inst:
            self.__log.e("Render error", str(inst.args))



    
    def stackAppend(self, data, name="user"):
        self.stack.append({
            "uname": "root", 
            "nname" : "server",
            "name": name,
            "id": "root/server/"+name}, 
            data)




    def getMsg(self):
        msg = Message( uname="root", nname="server", stack=self.stack)
        return(msg.json())




    def cmdTasklist(self, tasklist):
        tasks = []
        for task in tasklist:
            tasks.append(task["tname"])
        self.cmds.cmd("tasklist", tasks)




    def cmdFollowup(self, flist):
        self.cmds.cmd("followup", flist)




    def cmdPing(self, status):
        self.cmds.cmd("ping", status)




    def cmdMerge(self):
        clist = self.cmd.isThere(id=self.uri, delete=True)
        if(clist):
            cmd = {}
            for c in clist: 
                cmd[list(c)[0]] = c[list(c)[0]]
            self.cmds.cmd("task", cmd)




    async def stackAppendAndSend(self, data, name=None):
        self.cmdMerge()
        self.stackAppend(self.cmds.data, "command")
        self.stackAppend(data, name)
        self.write(self.getMsg())


