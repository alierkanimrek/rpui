#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    This file is part of Rplexus Server Application.

    Rplexus Server Application is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    Rplexus Server Application is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Rplexus Server Application.  If not, see <https://www.gnu.org/licenses/>.



    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''








import tornado 

from .base import BaseHandler
from lib.mail import sendMail
from ..user.mail import userInvitingMail












class XHRUGroup(BaseHandler):


    @tornado.web.authenticated
    async def post(self):
        self.__log = self.log.job("XHRUGrp")
        resp = {"result" : False}
        try:
            if("uname" in self.cstack.stack[0]["data"]):
                user = await self.db.getUser(uname=self.cstack.stack[0]["data"]["uname"])
            else:
                user = await self.db.getUser(uname=self.current_user)
            if(user):
                resp = {"groups": user["ugroup"].split(" "), "result" : True}
        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        await self.stackAppendAndSend(resp, "xhrugrp")






class XHRUpUGroup(BaseHandler):


    @tornado.web.authenticated
    async def post(self):

        self.__log = self.log.job("XHRUpUGroup")
        resp = {"result" : False}
        
        try:
            uname = self.cstack.stack[0]["data"]["uname"]
            ad = self.cstack.stack[0]["data"]["ad"]
            md = self.cstack.stack[0]["data"]["md"]
            ts = self.cstack.stack[0]["data"]["ts"]
            ugroups = ""
            if(ad): ugroups = "ad"
            if(md): ugroups += " md"
            if(ts): ugroups += " ts"
            # Update groups
            result = await self.db.updateUGroups(uname, ugroups)
            if(result):
                resp = {"result" : True}
            else:
                self.__log.w("Groups not updated", uname)

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrupdateugrp")








class XHRUInvite(BaseHandler):


    @tornado.web.authenticated
    async def post(self):

        self.__log = self.log.job("XHRUInvite")
        resp = {"result" : False}
        
        try:
            email = self.cstack.stack[0]["data"]["email"]
            if(await self.db.getUser(email=email)):
                self.__log.i("Invited email already user", email)
            
            result = await self.db.invite(email)
            if(result):
                # Send code to user email
                msg = userInvitingMail("en-us", email)
                send = await sendMail(self.conf.SERVER.outgoing_path, email, msg)
                resp = {"result" : True}
                self.__log.i("User invited", email)
            else:
                self.__log.w("Invite error", email)

        except Exception as inst:
            self.__log.e_tb("Runtime error", inst)
        
        await self.stackAppendAndSend(resp, "xhrinvite")
