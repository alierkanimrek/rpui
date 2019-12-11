#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


from tornado import gen

from .base import BaseHandler
from .login import LoginHandler
from . import xhr




class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession(update=True)
        await self.render_page()








userRouting = [
    (r"/", LoaderHandler),
    (r"/user/login", LoaderHandler),
    (r"/user/signup", LoaderHandler),
    (r"/user/forgotpassw", LoaderHandler),
    (r"/user/changepassw", LoaderHandler),
    (r"/user/settings", LoaderHandler),
    (r"/user/help", LoaderHandler),
    (r"/user/agreement", LoaderHandler),
    (r"/user/privacyp", LoaderHandler),
    (r"/user/cookiep", LoaderHandler),
    (r"/xhr/ucheck", xhr.XHRUserCheckHandler),
    (r"/xhr/ucreate", xhr.XHRUserCreateHandler),
    (r"/xhr/ulogin", xhr.XHRUserLogin),
    (r"/xhr/supdate", xhr.XHRSessionUpdate),
    (r"/xhr/uforgot", xhr.XHRUserForgotPassw),
    (r"/xhr/usendcode", xhr.XHRUserSendCode),
    (r"/xhr/uchpassw", xhr.XHRUserChangePassw),
    (r"/xhr/xhrgetuser", xhr.XHRGetCurrentUser),
    (r"/xhr/xhrgetuprf", xhr.XHRGetUserProfile),
    (r"/xhr/xhrupuprf", xhr.XHRUpdateUserProfile),
    (r"/xhr/sendcc", xhr.XHRSendClientCode),
    (r"/xhr/signupcheck", xhr.XHRSignupCheckHandler)
    ]
  