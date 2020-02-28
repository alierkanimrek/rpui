#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .base import BaseHandler
from lib.store import UGroup
from . import xhr



class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession()
        if(self.current_user):
            user = await self.db.getUser(uname=self.current_user)
            grp = user["ugroup"].split(" ")
            if(user and (UGroup.ADMIN.value in grp or UGroup.ROOT.value in grp)):
                await self.render_page()
            else:
                self.redirect("/user/settings")
        else:
            self.redirect("/user/login")









adminRouting = [
    (r"/admin", LoaderHandler),
    (r"/xhr/getugrp", xhr.XHRUGroup),
    (r"/xhr/upugrp", xhr.XHRUpUGroup),
    (r"/xhr/invite", xhr.XHRUInvite),
    ]
  