# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "settings": {

            "static":{
                "firstNameLabel" : {"textContent":_("First name")},
                "lasetNameLabel" : {"textContent":_("Last name")},
                "descLabel" : {"textContent":_("About yourself")},
                "nodesLink" : {"textContent":_("Nodes")},
                "changePassLink" : {"textContent":_("Change Password")},
                "sendCodeLink" : {"textContent":_("Send Client Code")},
                "userRemoveLink" : {"textContent":_("Remove me")}, 
            },

            "dynamic":{
                "sendBtnLabel" : _("Update"),
                "sending" : _("Updating..."),
                "updateError" : _("Not updated"),
                "updateSuccess" : _("Node updated")
            }
        }
    }

    return(locales)
