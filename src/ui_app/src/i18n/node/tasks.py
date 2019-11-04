# -*- coding: utf-8 -*-



def text(_):

    
    locales = {

        "tasks": {
 
            "static":{
                "subTitle" : {"textContent":_("This changes will affect your client and followers workflow")},
                "listLabel" : {"textContent":_("Task names")},
                "back" : {"textContent":_("Back")},
                "nodes" : {"textContent":_("Nodes")},
                "addBtn" : {"textContent":_("Add")},
                "AddNewLabel" : {"textContent":_("New task name")},
                
            },

            "dynamic":{
                "tname_patternMismatch" : _("Task name is not valid"),
                "tname_valueMissing" : _("Please enter valid name"),
                "tnameExist" : _("Task name is exist"),
                "tnameMsg" : _("Task name not available"),
                "sendBtnLabel" : _("Update"),
                "creating" : _("Creating..."),
                "createError" : _("Not created"),
                "createSuccess" : _("Created"),
                "AddNewBtn" : _("Add new"),
                "removeBtn" : _("Remove"),
                "removing" : _("Removing..."),
                "removeError" : _("Not removed"),
                "removeSuccess" : _("Removed"),
            }
        }
    }

    return(locales)
