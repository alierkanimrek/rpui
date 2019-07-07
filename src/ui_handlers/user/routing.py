#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


from tornado import gen

from .base import BaseHandler
from .login import LoginHandler
from .xhr import XHRCheckHandler







class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.render_page()








userRouting = [
    (r"/", LoaderHandler),
    (r"/user/login", LoaderHandler),
    (r"/user/signup", LoaderHandler),
    (r"/user/forgotpassw", LoaderHandler),
    (r"/user/help", LoaderHandler),
    (r"/user/agreement", LoaderHandler),
    (r"/user/privacyp", LoaderHandler),
    (r"/user/cookiep", LoaderHandler),
    (r"/xhr/check", XHRCheckHandler)
    ]
  