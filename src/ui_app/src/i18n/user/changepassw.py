# -*- coding: utf-8 -*-

import signup


def text(_):

    sup = signup.text(_)["signup"]

    locales = {

        "changepassw": {

            "static":{
                "title" : {"textContent":_("Change your password")},
                "subTitle" : {"textContent":_("Please specify a strong password")},
                "password" : {"textContent":sup["static"]["password"]["textContent"]},
                "passwInput" : {"placeholder":sup["static"]["passwInput"]["placeholder"]},
                "submit" : {"textContent":_("Change")},
                "help" : {"textContent":sup["static"]["help"]["textContent"]},
                "settings" : {"textContent":"Settings"},
                "nodes" : {"textContent":"Nodes"},
                "submitMsg" : {"textContent":_("Changing your password...")}
            },

            "dynamic":{
                "passw_tooShort" : sup["dynamic"]["passw_tooShort"],
                "passw_valueMissing" : sup["dynamic"]["passw_valueMissing"],
                "submitMsg" :_("Changing your password..."),
                "submitError" :_("Your password could not change"),
                "submitReady" : _("Your password changed, please login.")
            }
        }
    }

    return(locales)
