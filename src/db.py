#!/usr/bin/python
# -*- coding: utf-8 -*-

''' All rights reserved (c) 2018 Ali Erkan IMREK <alierkanimrek@gmail.com> '''








import time
import hashlib
import binascii

import motor
from bson.objectid import ObjectId
from tornado import gen








CLIENT_NOT_LISTENING = 0
CLIENT_WAITING_FOR_LISTENING = 1
CLIENT_LISTENING = 2
CLIENT_OFFLINE = 0
CLIENT_ONLINE = 1

    






class Db(object):




    def __init__(self, ip, uname, passw, port=27017):
        if ip:
            uri = "mongodb://{}:{}@{}:{}/rplexus".format(uname, passw, ip, port)
            self._client = motor.MotorClient(uri)
        else:
            self._client = motor.MotorClient()

        if self._client.connected:
            self._db = self._client.rplexus

            self._applicants = self._db.applicants
            self._applicants.create_indexes([("uname", 1), ("last", -1)])

            self._users = self._db.users
            self._users.create_indexes([("uname", 1), ("last", -1)])

            self._nodes = self._db.nodes
            self._nodes.create_indexes([("uid", 1)])

            self._tasks = self._db.tasks
            self._tasks.create_indexes([("nid", 1)])

            self._pool = self._db.pool
            self._pool.create_indexes([("tid", 1)])

            self._dockers = self._db.dockers
            self._dockers.create_indexes([("nid", 1)])


        else:
            raise Exception('3', "")



    @gen.coroutine
    def server_info(self):
        info = yield self._client.server_info()
        return(info)


    @gen.coroutine
    def get_counts(self):
        nodes = yield self._nodes.find().count()
        users = yield self._users.find().count()
        return({"nodes":nodes, "users":users})




    @gen.coroutine
    def get_hashed_passw(self, passw):
        passw = passw.encode()
        hashpassw = binascii.hexlify( 
            hashlib.pbkdf2_hmac(
                'sha256', 
                passw, 
                b'inan ve calis', 
                100000) )
        return(hashpassw.decode())




    @gen.coroutine
    def record_new_applicant(self, uname, email, passw, fname, lname, lang):
        hashpassw = yield self.get_hashed_passw(passw)
        newapplicant = {
            "uname": uname, 
            "email": email, 
            "passw": hashpassw, 
            "fname": fname, 
            "lname": lname,
            "lang": lang,
            "time": int(time.time())}
        doc = yield self._applicants.find_one({'uname': uname})
        if not doc:
            id = yield self._applicants.insert(newapplicant)
            return(id)




    @gen.coroutine
    def check_is_registered_user(self, uname="", email="", applicant=False, getdoc=False):
        doc_uname = yield self._users.find_one({'uname': uname})
        doc_email = yield self._users.find_one({'email': email})
        if doc_uname or doc_email:
            if getdoc and doc_uname:    return(doc_uname)
            elif getdoc and doc_email:  return(doc_email)
            else:   return(True)
        if applicant:
            doc_uname = yield self._applicants.find_one({'uname': uname})
            doc_email = yield self._applicants.find_one({'email': email})
            if doc_uname:
                if (int(time.time()) - doc_uname["time"]) < 240:
                    return(True)
                else:
                    yield self._applicants.remove(doc_uname["_id"])
            if doc_email:
                if (int(time.time()) - doc_email["time"]) < 240:
                    return(True)
                else:
                    doc_email = yield self._users.find_one({'email': email})
                    if doc_email:
                        yield self._applicants.remove(doc_email["_id"])




    @gen.coroutine
    def check_applicant_code(self, code, timeout = 480):
        doc_applicant = yield self._applicants.find_one({'_id': ObjectId(code)})
        if doc_applicant:
            if (int(time.time()) - doc_applicant["time"]) < int(timeout):
                yield self.record_new_user(
                    doc_applicant["uname"],
                    doc_applicant["email"],
                    doc_applicant["passw"],
                    doc_applicant["fname"],
                    doc_applicant["lname"],
                    doc_applicant["lang"])
                yield self._applicants.remove(doc_applicant["_id"])
                return(True)
            yield self._applicants.remove(doc_applicant["_id"])




    @gen.coroutine
    def record_new_user(self, uname, email, passw, fname, lname, lang):
        rcode = yield self.get_hashed_passw(uname)
        newuser = {
            "uname": uname, 
            "email": email, 
            "passw": passw, 
            "fname": fname, 
            "lname": lname,
            "lang": lang,
            "rcode": rcode,
            "lcode": "",
            "ltime": 0}
        doc = yield self._users.find_one({'uname': uname})
        if not doc:
            yield self._users.insert(newuser)
            return(True)




    @gen.coroutine
    def try_login(self, user, passw):
        hashpassw = yield self.get_hashed_passw(passw)
        doc_uname = yield self._users.find_one({'uname': user})
        doc_email = yield self._users.find_one({'email': user})
        if doc_uname:
            if doc_uname["passw"] == hashpassw:
                return(doc_uname["uname"], str(doc_uname["_id"]))
        elif doc_email:
            if doc_email["passw"] == hashpassw:
                return(doc_email["uname"], str(doc_email["_id"]))
        return(False, False)




    @gen.coroutine
    def try_login_code(self, code):
        doc = yield self._users.find_one({'lcode': code})
        if doc:
            if (int(time.time()) - doc["ltime"]) < 240:
                return(doc["uname"], str(doc["_id"]))
        return(False, False)




    @gen.coroutine
    def record_login_code(self, doc, code):
        doc["lcode"] = code
        doc["ltime"] = int(time.time())
        result = yield self._users.update({"_id": doc["_id"]}, doc)
        if result:
            return(True)
        else:            
            return(False)




    @gen.coroutine
    def check_login_code(self, logincode, cookie):
        doc = yield self._users.find_one({'logincode': logincode})
        if doc and ( (yield self.get_hashed_passw(logincode)) == cookie):
            return(doc["uname"])
        else:   return(False)




    @gen.coroutine
    def get_user(self, uname):
        userdoc = yield self._users.find_one({'uname': uname})
        return(userdoc)



    @gen.coroutine
    def get_user_from_id(self, uid):
        userdoc = yield self._users.find_one({'_id': ObjectId(uid)})
        return(userdoc)




    @gen.coroutine
    def update_user(self, uid, data):
        try:
            doc = yield self._users.find_one({'_id': ObjectId(uid)})
            doc["fname"] = data["fname"]
            doc["lname"] = data["lname"]
            doc["email"] = data["email"]
            doc["lang"] = data["lang"]
            if (yield self._users.update({'_id': doc["_id"]}, doc)):
                return(True)
            else:
                return(False)    
        except:
            return(False)




    @gen.coroutine
    def change_password(self, uid, newpassw):
        try:
            doc = yield self._users.find_one({'_id': ObjectId(uid)})
            hashpassw = yield self.get_hashed_passw(newpassw)
            doc["passw"] = hashpassw
            if (yield self._users.update({'_id': doc["_id"]}, doc)):
                return(True)
            else:
                return(False)    
        except:
            return(False)




    @gen.coroutine
    def get_user_nodes(self, uid):
        doc = yield self._nodes.find({'uid': uid}).to_list(None)
        return(doc)




    @gen.coroutine
    def get_node_tasks(self, nid):
        doc = yield self._tasks.find({'nid': nid}).to_list(None)
        for t in range(len(doc)):
            doc[t]["_id"] = str(doc[t]["_id"])
        return(doc)




    @gen.coroutine
    def update_node_task(self, nid, tid, rec):
        doc = yield self._tasks.find_one({'_id': ObjectId(tid), "nid": nid})
        if doc:
            try:
                rec["nid"] = nid
                del rec["_id"]
                doc = yield self._tasks.update({'_id': doc["_id"]}, rec)
                pdoc = yield self._pool.find_one({'tid': tid})
                pdoc["share"] = rec["share"]
                pdoc["access"] = rec["access"]
                pdoc = yield self._pool.update({"tid": tid}, pdoc)
                return(True)
            except:
                return(False)
        else:
            return(False)




    @gen.coroutine
    def record_new_task(self, rec):
        try:
            tid = yield self._tasks.insert(rec)
            if tid:
                pdoc = {
                    "tid": str(tid),
                    "nid" : rec["nid"],
                    "share" : rec["share"],
                    "access" : rec["access"],
                    "data" : {},
                    "last" : 0}
                if not (yield self._pool.insert(pdoc)):
                    raise
                return(True)
            else:
                raise
        except:
            return(False)




    @gen.coroutine
    def remove_task(self, tid):
        try:
            doc = yield self._tasks.find_one({'_id': ObjectId(tid)})
            result = yield self._tasks.remove(doc["_id"])
            doc = yield self._pool.find_one({'tid': tid})
            result = yield self._pool.remove(doc["_id"])
        except:
            return(False)
        return(True)




    @gen.coroutine
    def get_user_node(self, uid, name=""):
        doc = yield self._nodes.find_one({'uid': uid, 'name':name})
        return(doc)




    @gen.coroutine
    def get_user_node2(self, user, name):
        doc = yield self._nodes.find_one({'uname': user, 'name':name})
        return(doc)




    @gen.coroutine
    def get_node_from_nid(self, nid):
        doc = yield self._nodes.find_one({'_id': ObjectId(nid)})
        return(doc)




    @gen.coroutine
    def record_new_node(self, rec):
        try:
            nid = yield self._nodes.insert(rec)
            return(nid)
        except:
            return(False)




    @gen.coroutine
    def update_node(self, rec, oldname):
        try:
            doc = yield self._nodes.find_one({'uid': rec["uid"], 'name': oldname})
            rec["tlist"] = doc["tlist"]
            rec["share"] = doc["share"]
            rec["_id"] = doc["_id"]
            doc = yield self._nodes.update({'_id': rec["_id"]}, rec)
            return(True)
        except:
            return(False)




    @gen.coroutine
    def remove_node(self, uname, uid, nname):
        if True:#try:
            node = yield self._nodes.find_one({'uname': uname, 'uid':uid, 'name':nname})
            if node:
                #Remove from pool
                pools = yield self._pool.find({'nid': str(node["_id"])}).to_list(None)
                for pool in pools:
                    result = yield self._pool.remove(pool["_id"])
                #Remove docker
                doc = yield self._dockers.find_one({'nid': str(node["_id"])})
                if doc:
                    result = yield self._dockers.remove(doc["_id"])
                #Remove tasks
                tasks = yield self._tasks.find({'nid': str(node["_id"])}).to_list(None)
                for task in tasks:
                    result = yield self._tasks.remove(task["_id"])
                #Remove node
                result = yield self._nodes.remove(node["_id"])
                return(True)
            else:
                return(False)    
        else:#except:
            return(False)






    @gen.coroutine
    def update_node_tlist(self, uid, nname, tlist):
        try:
            doc = yield self._nodes.find_one({'uid': uid, 'name': nname})    
            doc["tlist"] = tlist
            doc = yield self._nodes.update({'_id': doc["_id"]}, doc)
            return(True)
        except:
            return(False)




    @gen.coroutine
    def node_status(self, nid):
        return(None)




    @gen.coroutine
    def status_of_user_nodes(self, uid):
        return(None)




    @gen.coroutine
    def putup_node(self, nid):
        pass




    @gen.coroutine
    def putup_user_nodes(self, uid):
        pass




    @gen.coroutine
    def update_pool(self, tid, data, nid, t):
        try:
            doc = yield self._pool.find_one({'tid': tid})
            doc["data"] = data
            doc["last"] = t
            doc = yield self._pool.update({"tid": tid}, doc)
        except Exception as e:
            print(e)
            """try:
                new = {
                    "tid": tid, 
                    "last" : t,
                    "nid" : nid,
                    "data" : data}
                doc = yield self._pool.insert(new)
            except:
                return(False)"""
            return(False)
        return(True)




    @gen.coroutine
    def get_task(self, tid):
        try:
            doc = yield self._pool.find_one({'tid': tid})
        except:
            return(False)
        return(doc)




    @gen.coroutine
    def get_task2(self, nid, tname):
        try:
            doc = yield self._tasks.find_one({'nid': nid, "name": tname})
        except:
            return(False)
        return(doc)



    """@gen.coroutine
    def get_dock(self, uname, nname):
        try:
            node = yield self._nodes.find_one({'uname': uname, 'name':nname})
            doc = yield self._dockers.find_one({'nid': str(node["_id"])})
        except:
            return(False)
        return(doc)"""




    @gen.coroutine
    def get_dock(self, nid):
        doc = yield self._dockers.find_one({'nid': nid})
        if doc:
            doc["_id"] = str(doc["_id"])
        return(doc)




    @gen.coroutine
    def get_nid_pool(self, nid, share=False):
        doc = yield self._pool.find({'nid': nid}).to_list(None)
        for t in range(len(doc)):
            del doc[t]["_id"]
            if not share:
                del doc[t]["share"]
        return(doc)




    @gen.coroutine
    def update_dock(self, nid, order):
        try:
            doc = yield self._dockers.find_one({'nid': nid})
            if doc:
                doc["order"] = order
                doc = yield self._dockers.update({"_id": doc["_id"]}, doc)
            else:
                doc = {"nid":nid, "order":order}
                doc = yield self._dockers.insert(doc)
        except:
            return(False)
        return(True)
