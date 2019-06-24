#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


from tornado import gen

from .base import BaseHandler
from .login import LoginHandler








class LoaderHandler(BaseHandler):
    



    @gen.coroutine
    def get(self):
        self.render_page()








userRouting = [
    (r"/", LoaderHandler),
    (r"/user/login", LoaderHandler),
    (r"/user/signup", LoaderHandler),
    (r"/user/forgotpassw", LoaderHandler),
    (r"/user/help", LoaderHandler),
    (r"/user/agreement", LoaderHandler),
    (r"/user/privacyp", LoaderHandler),
    (r"/user/cookiep", LoaderHandler)
    ]
  