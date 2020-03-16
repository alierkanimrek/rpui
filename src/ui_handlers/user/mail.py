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








def getTmp(lang, tmp):
    if(lang in tmp):        return(tmp[lang])
    else:                   return(tmp["en-us"])




def clientCodeMail(lang, uname, to, code, frm="noreply@rplexus.net"):
    tmp = getTmp(lang, CCTmp)
    mail = tmp.format(frm=frm, to=to, code=code, uname=uname)
    return(mail)




def userCodeMail(lang, uname, to, code, frm="noreply@rplexus.net"):
    tmp = getTmp(lang, UCTmp)
    mail = tmp.format(frm=frm, to=to, code=code, uname=uname)
    return(mail)




def userInvitingMail(lang, to, frm="noreply@rplexus.net"):
    tmp = getTmp(lang, UITmp)
    mail = tmp.format(frm=frm, to=to)
    return(mail)




CCTmp = {
    "en-us": """from    : Rplexus.net Service <{frm}>
to      : {to}
subject : Your client code

Dear {uname},

Your client code is;
{code}

You should paste the code to your client configuration file, 
then start/restart your client for connection to the server.

Regards.
"""
}





UCTmp = {
    "en-us": """from    : Rplexus.net Service <{frm}>
to      : {to}
subject : Your password recovery code

Dear {uname},

Your password recovery code is;
{code}

Regards.
"""
}




UITmp = {
    "en-us": """from    : Rplexus.net Service <{frm}>
to      : {to}
subject : You invited to join Rplexus network

Dear user,

You invited to be a member of Rplexus.net. 
If you accept the invitation, all you have to do is 
signup on rplexus.net using this e-mail address.

Regards.
"""
}






#print(clientCodeMail("tr-tr", "user12", "user@usr.com", "654321564"))
