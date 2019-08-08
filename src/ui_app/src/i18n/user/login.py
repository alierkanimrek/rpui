# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "login": {

            "static":{
                "loginTitle" : {"textContent":_("Login")},
                "loginSubTitle" : {"textContent":_("Please login to proceed.")},
                "loginUname" : {"placeholder":_("Your Username or Email")},
                "loginPassw" : {"placeholder":_("Your Password")},
                "loginRemember" : {"textContent":_(" Remember me")},
                "loginSubmit" : {"textContent":_("Login")},
                "loginSignup" : {"textContent":_("Sign up")},
                "loginForgot" : {"textContent":_("Forgot Password")},
                "loginHelp" : {"textContent":_("Need Help")},
                "loginMsg" : {"textContent":_("Logging in...")}

            },

            "dynamic":{
                "loginMsg" :_("Logging in..."),
                "loginError" :_("Unauthhorized"),
                "loginReady" : _("Welcome")            
            }
        }
    }

    return(locales)
