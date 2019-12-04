#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''


import time













async def sendMail(outpath, to, mail):
    try:
        t = str(time.time()).replace(".","")
        fn = "{path}/{to}_{t}.email".format(path=outpath, to=to, t=t)
        f = open(fn, "w")
        f.write(mail)
        f.close
    except:
        return(False)
    return(True)




