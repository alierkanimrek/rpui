# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "signup": {

            "static":{
                "title" : {"textContent":_("Join to rplexus network")},
                "subTitle" : {"textContent":_("Get started with a free account")},
                "email" : {"textContent":_("Email")},
                "emailInput" : {"placeholder":_("email")},
                "uname" : {"textContent":_("User name")},
                "unameInput" : {"placeholder":_("User name")},
                "password" : {"textContent":_("Password")},
                "passwordInput" : {"placeholder":_("Password")},
                "info" : {"innerHTML":_("By clicking Get Started now, you agree to Rplexus's <a href='/user/agreement'>User Agreement</a>, <a href='/user/privacyp'>Privacy Policy</a> and <a href='/user/cookiep'>Cookie Policy</a>.")},
                "submit" : {"textContent":_("Get started")},
                "help" : {"textContent":_("Help")},
                "login" : {"textContent":_("Login")}
            },

            "dynamic":{
                "emailInvalid" : _("Email is not valid"),
                "emailHas" : _("Email has already been recorded, please login."),
                "unameInvalid" : _("User name must be 5-24 length and lowercase alphanumeric characters."),
                "unameHas" : _("User name has already been taken."),
                "passwInvalid" : _("Password must be minimum 8 character length.")
            }
        }
    }

    return(locales)
