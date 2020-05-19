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




    async def checkSession(self):
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
            if(data):
                expire = checkSessionData(validator, data["hashedValidator"], data["expires"])
                if(expire > 0):
                    if(expire < 50):
                        data["expires"] = (datetime.datetime.now() + datetime.timedelta(minutes=int(self.conf.USERS.session_timeout))).timestamp()
                        #if(data["permanent"]):
                            # Change expired cookie to session cookie
                        #    data["permanent"] = False
                        #    self.setSession(user, selector, validator)
                        update = await self.db.updateSession(data)
                    return(True)
            self.__log.d("Session invalid or expired")
            await self.endSession()
            return(False)




    async def setSession(self, uname, selector, validator, persistent=False):
        if(persistent):
            self.baseHandler.set_secure_cookie("selector", str(selector), expires_days=int(self.conf.USERS.persistent_session_days))
            self.baseHandler.set_secure_cookie("validator", str(validator), expires_days=int(self.conf.USERS.persistent_session_days))
            self.baseHandler.set_secure_cookie("user", str(uname), expires_days=int(self.conf.USERS.persistent_session_days))
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
        expires = datetime.datetime.now() + datetime.timedelta(days=int(days))
    else:
        expires = datetime.datetime.now() + datetime.timedelta(minutes=int(minutes))
    
    data = {
    "validator": validator,
    "hashedValidator": hashedValidator,
    "expires": expires.timestamp(),
    "permanent": persistent}

    return(data)








def checkSessionData(validator, hashedValidator, expires):
    m = hashlib.sha256()
    m.update(validator.encode())
    hValidator = m.digest()
    if(hValidator != hashedValidator):
        return(False)
    
    diff = int(expires - datetime.datetime.now().timestamp())
    if(diff <= 0):
        return(diff)

    return(diff)
