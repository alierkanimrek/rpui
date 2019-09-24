# -*- coding: utf-8 -*-



def text(_):

    
    locales = {

        "newnode": {

            "static":{
                "CreateNewNodeButton" : {"textContent":_("Create")},
                "NewNodeNameLabel" : {"textContent":_("New Node Name")}
            },

            "dynamic":{
                "nname_typeMismatch" : _("Node name is not valid"),
                "nname_valueMissing" : _("Please enter valid name"),            
                "nnameSending" : _("Creating"),
                "createError" : _("Could not create."),
                "createSuccess" : _("Please edit your new node.")
            }
        }
    }

    return(locales)
