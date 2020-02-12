#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


import os
import json
import glob




class JText():

    


    def __init__(self, fn:str, lang:str, path:str = "", root:str=""):
        self._lang = lang
        self._glob = {}
        self._data = {}
        self.root = root

        if path == "":
            path, filename = os.path.split(os.path.abspath(__file__))

        glob = os.path.join(path, "glob.json")
        file = os.path.join(path, fn+".json")
        
        self._glob = self.__load(glob)
        self._data = self.__load(file)




    def __load(self, fn):
        fh = open(fn, "r")
        data = json.loads(fh.read())
        return(data[self._lang])




    @property
    def glob(self):
        return(self._glob)
    



    @property
    def data(self):
        return(self._data)
    