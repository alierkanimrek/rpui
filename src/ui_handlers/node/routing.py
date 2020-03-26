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








import tornado
from tornado import gen


from .base import BaseHandler
from . import xhr
from .rules import NODES_URL, NODEEDIT_URL, TASKSEDIT_URL, VIEW_URL



class LoaderHandler(BaseHandler):
    



    @tornado.web.authenticated
    async def get(self, *args):
        await self.session.checkSession()
        await self.render_page()








nodeRouting = [
    (NODES_URL, LoaderHandler),
    (NODEEDIT_URL, LoaderHandler),
    (TASKSEDIT_URL, LoaderHandler),
    (VIEW_URL, LoaderHandler),
    (r"/xhr/createnode", xhr.XHRNodeCreate),
    (r"/xhr/getnodes", xhr.XHRNodes),
    (r"/xhr/getnode", xhr.XHRNodeLoad),
    (r"/xhr/upnode", xhr.XHRNodeUpdate),
    (r"/xhr/chknodes", xhr.XHRChkNodes),
    (r"/xhr/gettasks", xhr.XHRNodeTasks),
    (r"/xhr/createtask", xhr.XHRCreateTask),
    (r"/xhr/deltask", xhr.XHRRemoveTask),
    (r"/xhr/getviews", xhr.XHRViews),
    (r"/xhr/createview", xhr.XHRViewCreate),
    (r"/xhr/getnodevars", xhr.XHRNodeVars),
    (r"/xhr/saveview", xhr.XHRViewUpdate),
    (r"/xhr/getview", xhr.XHRView),
    (r"/xhr/chkdata", xhr.XHRChkData),
    (r"/xhr/srcusr", xhr.XHRSearchUser),
    (r"/xhr/shrnodes", xhr.XHRSharedNodes),
    (r"/xhr/shrtasks", xhr.XHRSharedTasks),
    (r"/xhr/delview", xhr.XHRRemoveView)
    ]
  