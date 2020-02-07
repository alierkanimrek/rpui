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
                "userSelectLabel" : {"textContent":_("Shared users")},
                "ulistRemoveBtn" : {"textContent":_("Remove")},
                "followupLabel" : {"textContent":_("Followup")},
                "nodeSelectLabel" : {"textContent":_("")},
                "nodeSelectLabel" : {"textContent":_("Select node")},
                "taskSelectLabel" : {"textContent":_("Select task for followup")},
                "taskListLabel" : {"textContent":_("Followed tasks")},
                "tlistRemoveBtn" : {"textContent":_("Remove")},
                "back" : {"textContent":_("Back")},
                "tasks" : {"textContent":_("Tasks")},
                "remove" : {"textContent":_("Remove")},
                "removeMsg" : {"textContent":_("Clear description and write 'remove' then update for removing this node.")}
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
