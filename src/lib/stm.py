#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    The MIT License:

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''









import time








class STM(object):
    """
    Short Term Memory
    """



    def __init__(self, lifetime=30):
        """
        lifetime = second
                    zero means no lifetime
        
        self._set = {time : {id, id,...}, time : ...}

        self._dellist = [time, time,...]
        """
        #super(IdSet, self).__init__()
        self.lifetime = lifetime
        self._set = dict()
        self._dellist = []




    def add(self,id, t=None):
        if not t:    t=int(time.time())
        else:   t=int(t)
        if not self.isThere(id, t, forAdd=True):
            try:
                self._set[int(t)].add(id)
            except KeyError:
                self._set[int(t)] = set({id})




    def isThere(self, id, t=None, forAdd=False):
        if not t:    t=int(time.time())
        else:   t=int(t)
        #print("\n", id, t - self.lifetime, self._set) #Debug
        for s in self._set.keys():
            #print("\t", s) #Debug
            #if t - self.lifetime > s and self.lifetime > 0: Zero Fix

            #if   expired time   > s:
            if t - self.lifetime > s:

                if s not in self._dellist:
                    self._dellist.append(s)
                    #print("\tDel", self._dellist) #Debug
            else:
                # Hit
                for x in self._set[s]:
                    if id == x:
                        # print("\tHit") #Debug
                        # Hit but near the expire time
                        # Using only inside add method for keep the id
                        if t - self.lifetime == s and forAdd:
                            #print("Hit but ignore") #Debug
                            break
                        return(True)
        self._del()
        return(False)




    def whichTime(self, id):
        for s in sorted(self._set.keys(), reverse=True):
            if id in self._set[s]:
                return(s)
        return(False)




    def _del(self):
        #print("\nDeleting", self._dellist) #Debug
        for s in self._dellist:
            try:    del self._set[s]
            except: pass
        self._dellist = []




    def count(self, t=None):
        if not t:    t=int(time.time())
        else:   t=int(t)
        self._del()
        l = []
        for s in self._set.keys():
            if t - self.lifetime > s:
                self._dellist.append(s)
            else:
                for k in self._set[s]:
                    if k not in l:
                        l.append(k)
        return(len(l))





    @property
    def set(self):
        return self._set



"""a = STM(2)

for i in range(0,10):
    a.add(i)

for i in range(10,20):
    a.add(i, time.time())
time.sleep(1)
for i in range(20,30):
    a.add(i, time.time())

time.sleep(1)

for i in range(40,50):
    a.add(i, time.time())

for i in range(0,30):
    print(a.isThere(i))

print(a.count())
"""