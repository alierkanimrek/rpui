#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''




from .login import LoginHandler





userRouting = [
    (r"/", LoginHandler)
    ]