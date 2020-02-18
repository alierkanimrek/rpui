#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .base import BaseHandler




class LoaderHandler(BaseHandler):
    



    
    async def get(self):
        await self.session.checkSession()
        await self.render_page()








frontRouting = [
    (r"/", LoaderHandler)
    ]
  