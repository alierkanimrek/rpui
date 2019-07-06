#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''





from .base import BaseHandler







class XHRCheckHandler(BaseHandler):
    



    
    async def post(self):
        print(self.request)
        self.write("test")
