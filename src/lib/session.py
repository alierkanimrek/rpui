#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import datetime

from .passlock import *








class SessionManager(object):





    def __init__(self, baseHandler):
        self.db = baseHandler.db
        self.__log = baseHandler.log.job("SessionMan")
        self.conf = baseHandler.conf
        self.baseHandler = baseHandler




    async def createSession(self, uname, persistent=False):
        '''
            Session policy

            data["selector"] = auth db id, set as cookie
            validator = random string, set as cookie
            data["hashedValidator"] = hashed validator, stored to auth db
            data["uname"] = user name, stored to auth db            
            data["expires"] = timestamp value of expires, stored to auth db
        '''
        #Create sessin data and save it
        data = getSessionData(persistent, days=self.conf.USERS.persistent_session_days, minutes=self.conf.USERS.session_timeout)
        data["uname"] = uname
        validator = data["validator"]
        del data["validator"]
        selector = await self.db.createSession(data)
        if(selector):
            #Set session to browser
            await self.setSession(uname, selector, validator, persistent)




    async def checkSession(self, update=False):
        #Get cookies
        try:
            user =self.baseHandler.get_secure_cookie("user").decode()
            selector =self.baseHandler.get_secure_cookie("selector").decode()
            validator =self.baseHandler.get_secure_cookie("validator").decode()
        except:
            await self.endSession()
            return(False)
        if(user and selector and validator):
            #Get auth data and check it
            data = await self.db.getSession(selector, user)
            if(data and checkSessionData(validator, data["hashedValidator"], data["expires"])):
                if(update):
                    await self.updateSession()
                return(True)
            else:
                self.__log.d("Session invalid or expired")
                await self.endSession()
                return(False)                




    async def setSession(self, uname, selector, validator, persistent=False):
        if(persistent):
            self.baseHandler.set_secure_cookie("selector", str(selector), expires_days=self.conf.USERS.persistent_session_days)
            self.baseHandler.set_secure_cookie("validator", str(validator), expires_days=self.conf.USERS.persistent_session_days)
            self.baseHandler.set_secure_cookie("user", str(uname), expires_days=self.conf.USERS.persistent_session_days)
        else:
            self.baseHandler.set_secure_cookie("selector", str(selector), expires_days=None)
            self.baseHandler.set_secure_cookie("validator", str(validator), expires_days=None)
            self.baseHandler.set_secure_cookie("user", str(uname), expires_days=None)




    async def endSession(self):
        try:
            selector =self.baseHandler.get_secure_cookie("selector").decode()
            await self.db.removeSession(selector)
        except:
            pass
        self.baseHandler.clear_cookie("user")
        self.baseHandler.clear_cookie("selector")
        self.baseHandler.clear_cookie("validator")



    async def updateSession(self):
        #Get cookies
        try:
            user =self.baseHandler.get_secure_cookie("user").decode()
            selector =self.baseHandler.get_secure_cookie("selector").decode()
            validator =self.baseHandler.get_secure_cookie("validator").decode()
        except:
            await self.endSession()
            return(False)
        if(user and selector and validator):
            #Get auth data and check it
            data = await self.db.getSession(selector, user)
            if(checkSessionData(validator, data["hashedValidator"], data["expires"])):
                diff = int(data["expires"] - datetime.datetime.now().timestamp())
                if(diff < (self.conf.USERS.session_timeout * 60) and diff > 0):
                    # in range of 0-5 minutes update session
                    await self.createSession(user)
                    #await self.db.removeSession(selector)
                    return(True)
            self.__log.d("Session invalid or expired")
            await self.endSession()
            return(False)                





def getSessionData(persistent=False, days=30, minutes=5):

    # Generate session validator
    validator = ""
    for x in range(10): 
        validator += str(random.randint(1, 101))
    m = hashlib.sha256()
    m.update(validator.encode())
    hashedValidator = m.digest()

    # session is same as DB id

    # timestamp for expires
    if(persistent):
        expires = datetime.datetime.now() + datetime.timedelta(days=days)
    else:
        expires = datetime.datetime.now() + datetime.timedelta(minutes=minutes)

    data = {
    "validator": validator,
    "hashedValidator": hashedValidator,
    "expires": expires.timestamp()}

    return(data)








def checkSessionData(validator, hashedValidator, expires):
    m = hashlib.sha256()
    m.update(validator.encode())
    hValidator = m.digest()
    if(hValidator != hashedValidator):
        return(False)
    
    diff = expires - datetime.datetime.now().timestamp()
    if(diff <= 0):
        return(False)

    return(True)
