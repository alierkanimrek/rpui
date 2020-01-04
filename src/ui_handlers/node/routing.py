#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


import tornado
from tornado import gen


from .base import BaseHandler
from . import xhr
from .rules import NODES_URL, NODEEDIT_URL, TASKSEDIT_URL, VIEW_URL



class LoaderHandler(BaseHandler):
    



    @tornado.web.authenticated
    async def get(self, *args):
        await self.session.checkSession(update=True)
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
    (r"/xhr/saveview", xhr.XHRViewUpdate)
    ]
  