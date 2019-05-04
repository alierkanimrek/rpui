#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import json
import time

import tornado










class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.db = self.settings['db']
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.t = int(time.time())
        self.job = self.log.job("UI base handling")
        #self.uid = ""
        #self.stack = Stack()
        #self.cstack = Stack()
        #self.alive = self.settings['alive']
        #self.owners = self.settings['owners']
        #self.coms = self.settings["coms"]
        #self.source = {
        #    "uname": self.conf["SERVER"]["server_name"], 
        #    "nname": self.conf["SERVER"]["server_node"], 
        #    "name": "",
        #    "id": ""}



    """
    def get_current_user(self):
        if self.get_secure_cookie("user") and self.get_secure_cookie("uid"):
            self.uid = tornado.escape.xhtml_escape(self.get_secure_cookie("uid"))
            uname = tornado.escape.xhtml_escape(self.get_secure_cookie("user"))
            self.owners.add(uname, self.t)
            if str(self.get_secure_cookie("r"),"utf8") != "on":
                if self.get_cookie("rs"):
                    df = str(self.get_secure_cookie("df", self.get_cookie("rs")),"utf8")
                    if df != str(uname)+str(self.uid):
                        return()
                else:
                    return()
            return(uname)
        else:
            return()
"""




    def render_page(self, template):
        try:
            #if self.current_user:
                #db["uname"] = self.current_user
            self.render(template+".html",
                xsrf_value = self.xsrf_token)
        except Exception as inst:
            self.job.e("Render error", template, str(inst.args))
        