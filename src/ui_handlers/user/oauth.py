#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    This file is part of Rplexus Server Application.

    Rplexus Server Application is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Rplexus Server Application is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Rplexus Server Application.  If not, see <https://www.gnu.org/licenses/>.



    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''



from google.oauth2 import id_token
from google.auth.transport import requests


GID = '291313068128-jbjdvb6mt6c8r01toi9qs1bbclal5t0k.apps.googleusercontent.com'












class GoogleOAuth2():
    



    def check(self, token):
        try:
            # Code from https://developers.google.com/identity/sign-in/web/backend-auth
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GID)
            if idinfo['iss'] in ['accounts.google.com', 'https://accounts.google.com']:
                return(False, idinfo['email'], str(idinfo['exp']))
        except Exception as inst:
            return(inst, "", "")
