# -*- coding: utf-8 -*-



def text(_):

    
    locales = {

        "cvitemedit": {
 
            "static":{
                "titleLabel" : {"textContent":_("Control title")},
                "editableLabel" : {"textContent":_("Editable")},
                "autosendLabel" : {"textContent":_("Auto-send")},
                "widgetLabel" : {"textContent":_("Control widget")},
                "varsTitle" : {"textContent":_("Variables and Tasks")},
                "staticTitle" : {"textContent":_("Static variables")}
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
