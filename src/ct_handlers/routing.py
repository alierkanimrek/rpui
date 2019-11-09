#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .xhr import XHRClientAuth, XHRClientPing










clientRouting = [
    (r"/xhr/ctlogin", XHRClientAuth),
    (r"/xhr/ctping", XHRClientPing)
    ]

