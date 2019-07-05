#!/usr/bin/python
# -*- coding: utf-8 -*-





import time
from bson.objectid import ObjectId
import functools
import tornado
import motor








class RpMongoClient(object):




    def __init__(self):
        self._client = None
        self._uri = None
        self._db = None




    def connect(self, ip, uname, passw, port=27017, callback=None):
        self._uri = "mongodb://{}:{}@{}:{}/rplexus".format(uname, passw, ip, port)
        self._client = motor.MotorClient(self._uri, connectTimeoutMS=1000)
        self._db = self._client.rplexus
        if(callback):
            f = self._client.server_info()
            f.add_done_callback(callback)



