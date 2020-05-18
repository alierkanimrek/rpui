# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "base": {

            "static":{
                "mainMenuLgTitle" : {"textContent":_("Application Language")},
                "mainMenuVpTitle" : {"textContent":_("Application View Mode")},
                "mainMenuUrTitle" : {"textContent":_("User")},
                "mainMenuVpDesktopLabel" : {"textContent":_("Desktop")},
                "mainMenuVpHandLabel" : {"textContent":_("Hand")},
                "mainMenuVpWallLabel" : {"textContent":_("Wall")},
                "mainMenuUrSettingsButton" : {"textContent":_("Settings")},
                "mainMenuUrLogoutLink" : {"textContent":_("Logout")},
                "mainMenuUrAdminButton" : {"textContent":_("Admin")}
            },

            "dynamic":{
                "loginCodeSent" : _("Login code sent to your email"),
                "loginAuthError" : _("Not permitted.")
            }
        }
    }

    return(locales)
