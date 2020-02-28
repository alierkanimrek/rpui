#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .base import BaseHandler




class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession()
        await self.render_page()








class XHRStatus(BaseHandler):


    
    async def post(self):
        self.__log = self.log.job("XHRStatus")
        status = {"status" : {"server" : False, "signup": False}}
        try:
            if(self.conf.USERS.signup == "yes"):
                status["status"]["signup"] = True
            if(self.conf.SERVER.maintenance == "no"):
                status["status"]["server"] = True
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(status, "xhrstatus")








frontRouting = [
    (r"/", LoaderHandler),
    (r"/xhr/getst", XHRStatus)
    ]
  