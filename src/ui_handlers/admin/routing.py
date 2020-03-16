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
  