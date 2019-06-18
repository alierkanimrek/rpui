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
	"default" : path
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

SERVER["signup"] = {
	"type" : "str", 
	"values" : ["yes", "no"],
	"default" : "yes"
	}

SERVER["maintenance"] = {
	"type" : "str", 
	"values" : ["yes", "no"],
	"default" : "no"
	}



USERS = {}

USERS["cookie_exp_logincode"] = {
	"type" : "int", 
	"values" : [],
	"range" : [60,120],
	"default" : 60
	}

USERS["cookie_exp_user"] = {
	"type" : "int", 
	"values" : [],
	"range" : [2500000,9500000],
	"default" : 2500000
	}

USERS["signup_verify_timeout"] = {
	"type" : "int", 
	"values" : [],
	"range" : [480,1000],
	"default" : 480
	}