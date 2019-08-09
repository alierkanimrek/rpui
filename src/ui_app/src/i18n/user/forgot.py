# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "forgot": {

            "static":{
                "title" : {"textContent":_("Trouble to login?")},
                "subtitle" : {"textContent":_("You can reset your password.")},
                "maillabel" : {"textContent":_("Your Email")},
                "mailinput" : {"placeholder":_("Email")},
                "info" : {"textContent":_("We'll send the code to your inbox or spam box.")},
                "mailsend" : {"textContent":_("Send")},
                "helplink" : {"textContent":_("Help")},
                "loginlink" : {"textContent":_("Login")},
                "codelabel" : {"textContent":_("Code")},
                "codeinput" : {"placeholder":_("Code")},
                "codeinfo" : {"textContent":_("Please enter the code that we sent to your email just now")},
                "codesend" : {"textContent":_("Send")},

            },

            "dynamic":{
                "mailnotfound" : _("This email not found."),
                "codesent" : _("We've sent the code to your email inbox or spam box. You can see the message in a few minutes."),
                "codesenderror" : _("There is a problem at server, please try again later."),
                "codeverified" : _("Correct"),
                "codenotverified" : _("Code is wrong")
            }
        }
    }

    return(locales)
