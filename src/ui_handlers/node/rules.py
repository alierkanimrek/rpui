#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




UNAME = '[a-z0-9_]{3,20}'
NNAME = '[a-z0-9_]{3,20}'

NODES_URL = r"^[\\s\\/]"+UNAME
NODEEDIT_URL =  r"^[\\s\\/]"+UNAME+"[\\s\\/]"+NNAME+"[\\s\\/]edit"
TASKSEDIT_URL =  r"^[\\s\\/]"+UNAME+"[\\s\\/]"+NNAME+"[\\s\\/]edit[\\s\\/]tasks"
