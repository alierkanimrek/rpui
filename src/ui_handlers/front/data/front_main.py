#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


from .base import JText

NAME = "front_main"


class FrontMain(JText):

    
    def __init__(self, lang:str, heap:str):
        super(FrontMain, self).__init__(fn=NAME, lang=lang, root=heap)