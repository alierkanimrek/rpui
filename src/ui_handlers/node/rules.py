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








UNAME = '[a-z0-9_]{3,20}'
NNAME = '[a-z0-9_]{3,20}'
VNAME = '[a-z0-9_]{3,20}'

NODES_URL = r"^[\\s\\/]"+UNAME
NODEEDIT_URL =  r"^[\\s\\/]"+UNAME+"[\\s\\/]"+NNAME+"[\\s\\/]edit"
TASKSEDIT_URL =  r"^[\\s\\/]"+UNAME+"[\\s\\/]"+NNAME+"[\\s\\/]edit[\\s\\/]tasks"
VIEW_URL = r"^[\\s\\/]"+UNAME+"[\\s\\/]view[\\s\\/]"+VNAME
