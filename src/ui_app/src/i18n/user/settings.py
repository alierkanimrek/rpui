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
                "codeInfoLabel":  {"textContent":_("You can send your Client Code to your email.")},
                "removeMsg" : {"textContent":_("Clear your first name and write 'remove me' then update for removing.")}
            },

            "dynamic":{
                "sendBtnLabel" : _("Update"),
                "sending" : _("Updating..."),
                "updateError" : _("Not updated"),
                "updateSuccess" : _("Node updated"),
                "SendCodeBtn" : _("Send"),
                "codeSending" : _("Sending..."),
                "codeSuccess" : _("Check your email"),
                "codeError" : _("Not sent")
            }
        }
    }

    return(locales)
