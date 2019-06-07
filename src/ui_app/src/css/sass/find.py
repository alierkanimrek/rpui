#!/usr/bin/python
# -*- coding: utf-8 -*-


for x in range(1,10000):
    r1 = str(x/12)
    r2 = str(x/16)
    if r1[len(r1)-2] == ".":
        if r2[len(r2)-2] == ".":
            print(x, end=", ")
