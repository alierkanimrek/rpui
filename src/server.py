#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import sys, os
sys.path.append(os.getcwd())

from tornado import gen, ioloop, web

from kitbox.conf import KBConfig
from kitbox.log import KBLogger

from lib.store import Store
from lib.stm import STM
from lib.buffer import Buffer

from ui_handlers.front.routing import frontRouting
from ui_handlers.user.routing import userRouting
from ui_handlers.node.routing import nodeRouting
from ct_handlers.routing import clientRouting







conf = None
log = None
db = None



"""
    Init configuration and Log system 

"""
try:
    print("rplexus server initializing...")

    conf = KBConfig("config","./")
    log = KBLogger(conf.LOG.log_file, "rplexus")
    log.level = conf.LOG.log_level
    
    stage1 = log.job("Stage1")
    stage1.i("Configuration loaded", 
        "log_level:"+conf.LOG.log_level, 
        "maintenance:"+conf.SERVER.maintenance)

except Exception as inst:
    print("Initializing failed")
    print(type(inst))
    print(inst.args)
    print(inst)
    sys.exit(-1)






"""
    Init Db connection

"""
try:
    stage1.i("DB Connecting",     
        str(conf.SERVER.db_ip), 
        str(conf.SERVER.db_port)
    )

    db = Store()

    def initStatus(f):
        if(not f.exception()):
            stage1.d("DB connected")
        else:
            stage1.e("DB connection error", str(f.exception()))

    db.connect(
        conf.SERVER.db_ip, 
        conf.SERVER.db_username, 
        conf.SERVER.db_password,
        conf.SERVER.db_port,
        initStatus)

except Exception as inst:
    stage1.e_tb("DB connection error", inst)
    sys.exit(-1)



@gen.coroutine
def reload():
    if not ioloop.IOLoop.current().reloader.is_running():
        ioloop.IOLoop.current().reloader.start()
    else:
        try:
            conf.reload()
            log.level = conf.LOG.log_level
            stage1.d("Conf updated")
        except Exception as inst:
            stage1.e_tb("Conf updating failed", inst)
    




routing = frontRouting + userRouting + nodeRouting + clientRouting



application = web.Application(
    routing,
    debug = True,
    conf = conf,
    log = log,
    db = db,
    cookie_secret = conf.SERVER.cookie_key,
    xsrf_cookies = True, 
    template_path = conf.SERVER.template_path,
    login_url = "/user/login",
    alive = STM(),
    touch = STM(),
    cmd = Buffer()
    )




if __name__ == "__main__":
    application.listen(8000)
    stage1.i("Server listening...")
    mainloop = ioloop.IOLoop.instance()
    #mainloop.reloader = ioloop.PeriodicCallback(reload, 60000)
    #mainloop.add_callback(reload)
    mainloop.start()
    
