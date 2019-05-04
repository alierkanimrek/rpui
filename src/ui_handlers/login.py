#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








from tornado import gen, web, escape

from .base import BaseHandler









class LoginHandler(BaseHandler):
    



    @gen.coroutine
    def get(self):
        self.render_page("login")
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
