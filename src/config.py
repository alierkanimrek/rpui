#!/usr/bin/python
# -*- coding: utf-8 -*-


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
