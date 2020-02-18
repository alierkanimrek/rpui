# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "front": {

            "static":{ 
                "banner" : {"textContent":_("An end-to-end open source machine connecting platform")},
                "subli1" : {"textContent":_("Device to Device connection")},
                "subli2" : {"textContent":_("Free to use")},
                "btnLogin" : {"textContent":_("Get started")},
                "card1title" : {"textContent":_("For Users")},
                "card1txt" : {"innerHTML":_("Rplexus is still in testing and we only accept testers. We advise you to check the new user registration status by monitoring the server status. If you still want to try it, write to us for an invitation. We do not recommend using it in production and no warranty is offered.")},
                "card2title" : {"textContent":_("For Coders")},
                "card2txt" : {"innerHTML":_("If you are familiar to <strong>Raspberry Pi</strong> like devices and write some <strong>Python</strong>, Rplexus is for you. Perhaps you are developing a web interface with <strong>Typescript</strong>. Please request an invitation to become a tester, our codes are already open. Click here for documents.")},
                "card3title" : {"textContent":_("Server Status")}
            },

            "dynamic":{
            }
        }
    }

    return(locales)
