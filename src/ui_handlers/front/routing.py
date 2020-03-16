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
  