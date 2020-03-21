# -*- coding: utf-8 -*-


def text(_):
        
    locales = {

        "front": {

            "static":{ 
                "banner" : {"textContent":_("An open source machine connecting and smart home creation platform")},
                "subli1" : {"innerHTML":_("&bull; Device to Device connection")},
                "subli2" : {"innerHTML":_("&bull; Observe, Control and Automate")},
                "subli3" : {"innerHTML":_("&bull; Create smart solutions")},
                "subli4" : {"innerHTML":_("&bull; Free to use")},
                "btnLogin" : {"textContent":_("Login")},
                "btnSignup" : {"textContent":_("Sign up")},
                
                "whattitle" : {"textContent":_("What can you do")},

                "observetitle" : {"textContent":_("Observe")},
                "observetxt" : {"innerHTML":_("You can visualize the your data. Just install a small app on your <strong>Raspberry Pi</strong> like device and decide which data to receive from the sensors.")},
                "controltitle" : {"textContent":_("Control")},
                "controltxt" : {"innerHTML":_("You can change the data from the web interface and send it to your device. You decide <strong>with your own codes</strong> how your device will behave with this data. Everything is under your control.")},
                "automatetitle" : {"textContent":_("Automate and Share")},
                "automatetxt" : {"innerHTML":_("You can allow your friends devices to read the your data. You can set up a <strong>cross-device world wide network</strong>. You can create smart solutions with your codes.")},
                
                "howtitle" : {"textContent":_("How can you do")},
                "card1title" : {"textContent":_("For Users")},
                "card1txt" : {"innerHTML":_("Rplexus is still in testing and we only accept testers. We advise you to check the new user registration status by monitoring the server status.")},
                "card2title" : {"textContent":_("For Coders")},
                "card2txt" : {"innerHTML":_("If you are familiar to <strong>Raspberry Pi</strong> like devices and write some <strong>Python</strong>, Rplexus is for you. Perhaps you are developing a web interface with <strong>Typescript</strong>. <a href='https://alierkanimrek.github.io/rplexusdocs/getting-started/' target='_blank'><strong>Let's get started.</strong></a>")},
                "card3title" : {"textContent":_("Server Status")},
                "serverlabel" : {"textContent":_("Server online status")},
                "signuplabel" : {"textContent":_("New user accepting")}
            },

            "dynamic":{
            }
        }
    }

    return(locales)
