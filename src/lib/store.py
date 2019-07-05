#!/usr/bin/python
# -*- coding: utf-8 -*-





import time
from bson.objectid import ObjectId

import tornado
import motor

from .store_mongo import RpMongoClient








class Store(object):
    




    def __init__(self):
        self._db = RpMongoClient()   





    def connect(self, ip, uname, passw, port=27017, callback=None):
        self._db.connect(ip, uname, passw, port, callback)





