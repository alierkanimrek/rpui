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








from tornado import gen

from .base import BaseHandler
from .login import LoginHandler
from . import xhr




class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession()
        await self.render_page()








userRouting = [
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
  