# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "forgot": {

            "static":{
                "forgotTitle" : {"textContent":_("Trouble Logging In?")},
                "forgotSubTitle" : {"textContent":_("You can reset your password.")},
                "forgotEmailUname" : {"textContent":_("Email or Username")},
                "forgotEmailUnameInput" : {"placeholder":_("email or user name")},
                "forgotInfo" : {"textContent":_("We'll send your inbox or spam box an information to reset your password.")},
                "forgotSubmit" : {"textContent":_("Send")},
                "forgotHelp" : {"textContent":_("Help")},
                "forgotLogin" : {"textContent":_("Login")},
            },

            "dynamic":{
                "loginCodeSent" : _("Login code sent to your email"),
                "loginAuthError" : _("Not permitted.")
            }
        }
    }

    return(locales)
