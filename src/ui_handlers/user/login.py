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









from tornado import gen, web, escape

from .base import BaseHandler









class LoginHandler(BaseHandler):
    



    @gen.coroutine
    def get(self):
        self.render_page()
        """
        if self.current_user:
            self.redirect("/"+escape.xhtml_escape(
                self.get_secure_cookie("user").decode("utf-8")))
        else:
            if self.get_argument_or_empty("code"):
                user, uid = yield self.db.try_login_code(self.get_argument_or_empty("code"))
                if user:
                    yield self.login(user, uid, True)
                else:
                    self.logit("error", "Invalid login code")
                    self.render_page("login", error = "loginAuthError")
            else:
                self.render_page("login")
        """
