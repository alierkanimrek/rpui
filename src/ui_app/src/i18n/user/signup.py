# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "signup": {

            "static":{
                "signupTitle" : {"textContent":_("Join to rplexus network")},
                "signupSubTitle" : {"textContent":_("Get started with a free account")},
                "signupEmail" : {"textContent":_("Email")},
                "signupEmailInput" : {"placeholder":_("email")},
                "signupUname" : {"textContent":_("User name")},
                "signupUnameInput" : {"placeholder":_("User name")},
                "signupPassword" : {"textContent":_("Password")},
                "signupPasswordInput" : {"placeholder":_("Password")},
                "signupInfo" : {"innerHTML":_("By clicking Get Started now, you agree to Rplexus's <a href='/user/agreement'>User Agreement</a>, <a href='/user/privacyp'>Privacy Policy</a> and <a href='/user/cookiep'>Cookie Policy</a>.")},
                "signupSubmit" : {"textContent":_("Get started")},
                "signupHelp" : {"textContent":_("Help")},
                "signupLogin" : {"textContent":_("Login")}
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
