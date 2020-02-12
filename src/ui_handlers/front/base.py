#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import tornado









class BaseHandler(tornado.web.RequestHandler):




    def initialize(self):
        self.log = self.settings['log']
        self.conf = self.settings['conf']
        self.__log = self.log.job("FBase")




    async def render_page(self, template, **kwargs):
        try:
            loader = tornado.template.Loader(self.settings['template_path'])
            self.finish(loader.load(template+".html").generate(template=template, **kwargs))
        except Exception as inst:
            self.__log.e_tb("Render error", inst)