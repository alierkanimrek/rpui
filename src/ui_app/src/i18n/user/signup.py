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
                "passwInput" : {"placeholder":_("Password")},
                "info" : {"innerHTML":_("By clicking Get Started now, you agree to Rplexus's <a href='/heap/termsofuse.html' target='_blank'>Terms of Use</a>, <a href='/heap/privacypolicy.html' target='_blank'>Privacy Policy</a> and <a href='/heap/cookiepolicy.html' target='_blank'>Cookie Policy</a>.")},
                "submit" : {"textContent":_("Get started")},
                "help" : {"textContent":_("Help")},
                "login" : {"textContent":_("Login")},
                "submitMsg" : {"textContent":_("Preparing your account...")},
                "blockmsg" : {"textContent":_("We do not accept new members temporarily.")},
                "gSignupLabel" : {"textContent":_("Sign up with Google")}
            },

            "dynamic":{
                "email_typeMismatch" : _("Email is not valid"),
                "email_valueMissing" : _("Please enter your email"),
                "email_customError" : _("You are already member, please login."),
                "uname_typeMismatch" : _("User name must be 5-24 length and lowercase alphanumeric characters."),
                "uname_valueMissing" : _("Please specify your user name"),
                "uname_customError" : _("User name has already been taken."),
                "passw_tooShort" : _("Password must be minimum 8 character length."),
                "passw_valueMissing" : _("Please specify your password"),
                "submitMsg" :_("Preparing your account..."),
                "submitError" :_("Something went wrong"),
                "submitReady" : _("Let's get it started")
            }
        }
    }

    return(locales)
