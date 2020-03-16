#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
    This file is part of Rplexus Server Application.

    Rplexus Server Application is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Rplexus Server Application is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Rplexus Server Application.  If not, see <https://www.gnu.org/licenses/>.



    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
'''








import os



path, filename = os.path.split(os.path.abspath(__file__))


LOG = {}

LOG["log_file"] = {
	"type" : "str", 
	"values": [],
	"default" : path+"/rplexus.log"
	}

LOG["log_level"] = {
	"type" : "str", 
	"values" : ["CRITICAL","ERROR","WARNING","INFO","DEBUG","NOTSET"],
	"default" : "DEBUG"
	}



SERVER = {}

SERVER["domain"] = {
	"type" : "str", 
	"values": [],	
	"default" : "rplexus.net"
	}

SERVER["server_name"] = {
	"type" : "str",
	"values": [],	 
	"default" : "server"
	}

SERVER["server_node"] = {
	"type" : "str", 
	"values": [],
	"default" : "root"
	}

SERVER["path"] = {
	"type" : "str", 
	"values": [],	
	"default" : path+"/outgoing"
	}

SERVER["template_path"] = {
	"type" : "str", 
	"values": [],	
	"default" : path+"/template"
	}

SERVER["heap_path"] = {
	"type" : "str", 
	"values": [],
	"default" : path+"/heap"
	}

SERVER["db_ip"] = {
	"type" : "str", 
	"values": [],
	"default" : "127.0.0.1"
	}

SERVER["db_username"] = {
	"type" : "str", 
	"values": [],
	"default" : "rpadmin"
	}

SERVER["db_password"] = {
	"type" : "str", 
	"values": [],
	"default" : ""
	}

SERVER["db_port"] = {
	"type" : "int", 
	"values": [],
	"range" : [],	
	"default" : 27017
	}

SERVER["outgoing_path"] = {
	"type" : "str", 
	"values": [],	
	"default" : path
	}

SERVER["maintenance"] = {
	"type" : "str", 
	"values" : ["yes", "no"],
	"default" : "no"
	}

SERVER["pass_key"] = {
	"type" : "str", 
	"values" : [],
	"default" : ""
	}

SERVER["cookie_key"] = {
	"type" : "str", 
	"values" : [],
	"default" : ""
	}




USERS = {}

USERS["session_timeout"] = {
	"type" : "int", 
	"values" : [],
	"range" : [2,60],
	"default" : 5
	}

USERS["persistent_session_days"] = {
	"type" : "int", 
	"values" : [],
	"range" : [1,90],
	"default" : 30
	}

USERS["banned_names"] = {
	"type" : "str", 
	"values" : [],
	"default" : "admin,administrator,root,user,xhr,static"
	}

USERS["admin_users"] = {
	"type" : "str", 
	"values" : [],
	"default" : ""
	}

USERS["signup"] = {
	"type" : "str", 
	"values" : ["yes", "no"],
	"default" : "yes"
	}

USERS["node_limit"] = {
	"type" : "int", 
	"values" : [],
	"range" : [0,5],
	"default" : 3
	}
