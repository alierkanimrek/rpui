# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "base": {

            "static":{
                "mainMenuLgTitle" : {"textContent":_("Application Language")},
                "mainMenuVpTitle" : {"textContent":_("Application View Mode")},
                "mainMenuVpDesktopLabel" : {"textContent":_("Desktop")},
                "mainMenuVpHandLabel" : {"textContent":_("Hand")},
                "mainMenuVpWallLabel" : {"textContent":_("Wall")}
            },

            "dynamic":{
                "loginCodeSent" : _("Login code sent to your email"),
                "loginAuthError" : _("Not permitted.")
            }
        }
    }

    return(locales)
