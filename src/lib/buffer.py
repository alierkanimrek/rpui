#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 x Erkan IMREK <xerkanimrek@gmail.com> '''








import time








class Buffer(object):




    def __init__(self, lifetime=20):
        """
        lifetime = second
                    zero means no lifetime
        
        self._set = {time : {id:[data,..], id:[data,..],...}, time : ...}

        self._dellist = [time, time,...]
        """
        #super(Buffer, self).__init__()
        self.lifetime = lifetime
        self._set = dict()
        self._dellist = []




    def add(self, id, data, t=None):
        if not t:    t=int(time.time())
        else:   t=int(t)
        if t in self._set:
            if id in self._set[t]:
                self._set[int(t)][id].append(data)
            else:
                self._set[int(t)][id] = [data]
        else:
            self._set[int(t)] = {}
            self._set[int(t)][id] = [data]




    def isThere(self, id, t=None, delete=False):
        if not t:    t=int(time.time())
        else:   t=int(t)

        datxst = []
        for s in self._set.keys():
            #print(t, s)
            #if t - self.lifetime > s and self.lifetime > 0: Zero Fix
            if t - self.lifetime > s:
                self._dellist.append(s)
            else:
                if id in self._set[s]:
                    datxst += self._set[s][id]
                    if delete:
                        del self._set[s][id]
        if len(self._dellist) > 0:    self._del()
        return(datxst)




    def _del(self):
        for s in self._dellist:
            del self._set[s]
        self._dellist = []





def test():
    a = Buffer(2)

    a.add("x", {"a":1})
    a.add("y", {"b":2})
    a.add("y", {"c":2})

    print(a.isThere("x"))
    print(a.isThere("y"))

    time.sleep(1)
    a.add("z", {"c":3})

    print(a.isThere("x"))
    print(a.isThere("y"))

    time.sleep(1)
    a.add("a", {"d":4})
    a.add("y", {"e":5})

    print(a.isThere("x"))
    print(a.isThere("y"))
    print(a.isThere("z"))
    print(a.isThere("a"))

#test()
