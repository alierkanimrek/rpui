#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .base import BaseHandler
from lib.store import USERGROUP_ADMIN




class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession()
        if(self.current_user):
            user = await self.db.getUser(uname=self.current_user)
            if(user and USERGROUP_ADMIN in user["ugroup"].split(" ")):
                await self.render_page()
            else:
                self.redirect("/user/settings")
        else:
            self.redirect("/user/login")









adminRouting = [
    (r"/admin", LoaderHandler)
    ]
  