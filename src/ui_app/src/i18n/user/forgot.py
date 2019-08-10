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
                "codeinfo" : {"textContent":_("Please enter the code that we sent to your email just now.")},
                "codesend" : {"textContent":_("Enter")},
                "resend" : {"textContent":_("Send again")}

            },

            "dynamic":{
                "email_typeMismatch" : _("Email is not valid"),
                "email_valueMissing" : _("Please enter your registered email"),
                "mailsending" : _("Sending..."),
                "mailnotfound" : _("This email not found or some error occured."),
                "codesending" : _("Checking..."),
                "codesenderror" : _("There is a problem at server, please try again later."),
                "codeverified" : _("Correct. You should specify your password now."),
                "codenotverified" : _("Code is wrong")
            }
        }
    }

    return(locales)
