#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import random
import datetime
import tornado

from .base import BaseHandler
from lib.store import Node











class XHRClientAuth(BaseHandler):


    
    async def post(self):
        #data = {"nname":...}
        self.__log = self.log.job("XHRClientAuth")
        resp = {"result" : False}
        await self.stackAppendAndSend(resp, "xhrclientauth")
        







'''
class LoginHandler(base.BaseHandler):




    @gen.coroutine
    def post(self):
        try:
            rq = tornado.escape.json_decode(self.request.body)
            self.logit("debug","'{}/{}' Connecting...".format( rq["uname"], rq["nodename"]))
            user = yield self.db.get_user(rq["uname"])
            node = yield self.db.get_user_node(str(user["_id"]), rq["nodename"])
            tasks = yield self.db.get_node_tasks(str(node["_id"]))
            if rq["rcode"] == user["rcode"] and node:
                self.set_secure_cookie("nid", str(node["_id"]))
                self.nname = node["name"]
                self.uname = user["uname"]
                self.logit("info","Logged in")
                self.append_task_command(tasks)
                uri = self.conf["SERVER"]["server_name"]+"/"+self.conf["SERVER"]["server_node"]+"/"+" "
                self.append_task(uri, {"ver":self.settings["ver"], "subver":self.settings["subver"]})
                self.write(self.message())
        except Exception as inst:
            self.logit("error","Login failed {}".format(str(inst.args)))
            self.write("Wrong id, rcode or node name")
'''