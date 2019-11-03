# -*- coding: utf-8 -*-



def text(_):

    
    locales = {

        "nodeedit": {
 
            "static":{
                "subTitle" : {"textContent":_("Edit your node")},
                "descLabel" : {"textContent":_("Description")},
                "accessLabel" : {"textContent":_("Sharing options")},
                "prvAccLabel" : {"textContent":_("Private")},
                "frdAccLabel" : {"textContent":_("Friends")},
                "pubAccLabel" : {"textContent":_("Everyone")},
                "back" : {"textContent":_("Back")},
                "tasks" : {"textContent":_("Tasks")}
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
