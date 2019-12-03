#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''






def getTmp(lang, tmp):
    if(lang in tmp):        return(tmp[lang])
    else:                   return(tmp["en-us"])




def clientCodeMail(lang, uname, to, code, frm=""):
    tmp = getTmp(lang, CCTmp)
    mail = tmp.format(frm=frm, to=to, code=code, uname=uname)
    return(mail)




CCTmp = {
    "en-us": """
from    : {frm}
to      : {to}
subject : Your client code

Hi {uname},

Your client code is;
{code}

You should paste the code to your client configuration file, 
then start/restart your client for connection to the server.

"""
}








#print(clientCodeMail("tr-tr", "user12", "user@usr.com", "654321564"))
