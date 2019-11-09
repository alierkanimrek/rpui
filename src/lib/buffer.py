#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import time








class Buffer(object):




    def __init__(self, lifetime=10):
        """
        lifetime = second
                    zero means no lifetime
        
        self._set = {time : {id:{data}, id:{data},...}, time : ...}

        self._dellist = [time, time,...]
        """
        #super(Buffer, self).__init__()
        self.lifetime = lifetime
        self._set = dict()
        self._dellist = []




    def add(self, id, data, t=None):
        if not t:    t=int(time.time())
        else:   t=int(t)
        try:
            self._set[int(t)][id] = data
        except KeyError:
            self._set[int(t)] = {}
            self._set[int(t)][id] = data





    def isThere(self, id, t=None, delete=False):
        if not t:    t=int(time.time())
        else:   t=int(t)
        self._del()
        for s in self._set.keys():
            #print(t, s)
            #if t - self.lifetime > s and self.lifetime > 0: Zero Fix
            if t - self.lifetime > s:
                #print("dellist ",s)
                self._dellist.append(s)
            else:
                if id in self._set[s]:
                    data = self._set[s][id]
                    if delete:
                        del self._set[s][id]
                    return(data)
        return(False)




    def _del(self):
        for s in self._dellist:
            del self._set[s]
        self._dellist = []





"""
a = Buffer(2)

a.add("ali", {"a":1})
a.add("veli", {"b":2})
time.sleep(1)
a.add("deli", {"c":3})
print(a.isThere("ali"))
time.sleep(1)
a.add("eli", {"d":4})
time.sleep(1)
time.sleep(1)

print(a.isThere("ali"))
print(a.isThere("veli"))
print(a.isThere("deli"))
print(a.isThere("eli"))
"""