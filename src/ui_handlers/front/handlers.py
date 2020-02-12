#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''



from .base import BaseHandler
from .data import FrontMain



class MainHandler(BaseHandler):

    
    async def get(self):
        temp = "front_main"
        fmain = FrontMain(lang="en-us", heap=self.conf.SERVER.heap_path)
        await self.render_page(
            template=temp,
            content=fmain
        )










frontRouting = [
    (r"/", MainHandler)
    ]
  