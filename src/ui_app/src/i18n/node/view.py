# -*- coding: utf-8 -*-



def text(_):

    
    locales = {

        "view": {
 
            "static":{
                "nodesLink" : {"textContent":_("Nodes")},
                "removeMe" : {"textContent":_("Remove")},
                "removeMsg" : {"textContent":_("Click here for removing your view")}

            },

            "dynamic":{
                "saveBtnLabel" : _("Save"),
                "saving" : _("Saving..."),
                "saveError" : _("Not saved"),
                "saveSuccess" : _("Saved")
            }
        }
    }

    return(locales)
