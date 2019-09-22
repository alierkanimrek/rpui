#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


import tornado
from tornado import gen


from .base import BaseHandler




class LoaderHandler(BaseHandler):
    



    @tornado.web.authenticated
    async def get(self, *args):
        await self.session.checkSession(update=True)
        await self.render_page()








nodeRouting = [
    (r"/([^/]+)", LoaderHandler)
    ]
  