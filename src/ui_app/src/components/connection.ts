import {RpMessage, RpStack, createRpMessage, createRpStack, parseStack} from "./msg"
import {createRpSource} from "./source"









const Uname = "root"
const Nname = "web"
const Name = ""


export enum Port{
    "ucheck" = "/xhr/ucheck",
    "ucreate" = "/xhr/ucreate",
    "ulogin" = "/xhr/ulogin",
    "supdate" = "/xhr/supdate",
    "uforgot" = "/xhr/uforgot",
    "usendcode" = "/xhr/usendcode",
    "uchpassw" = "/xhr/uchpassw",
    "getuser" = "/xhr/xhrgetuser",
    "newnode" = "/xhr/createnode",
    "getnode" = "/xhr/getnode",
    "getnodes" = "/xhr/getnodes",
    "upnode" = "/xhr/upnode",
    "chknodes" = "/xhr/chknodes",
    "gettasks" = "/xhr/gettasks",
    "createtask" = "/xhr/createtask",
    "deltask" = "/xhr/deltask",
    "getuprf" = "/xhr/xhrgetuprf",
    "upuprf" = "/xhr/xhrupuprf",
    "sendcc" = "/xhr/sendcc",
    "chksup" = "/xhr/signupcheck",
    "getviews" = "/xhr/getviews",
    "newview" = "/xhr/createview",
    "getview" = "/xhr/getview",
    "getnodevars" = "/xhr/getnodevars",
    "saveview" = "/xhr/saveview",
    "chkdata" = "/xhr/chkdata",
    "srcusr" = "/xhr/srcusr",
    "getshrnodes" = "/xhr/shrnodes",
    "getshrtasks" = "/xhr/shrtasks",
    "getugrp" = "/xhr/getugrp",
    "upugrp" = "/xhr/upugrp",
    "invite" = "/xhr/invite",
    "getst" = "/xhr/getst"
}

export interface ResponseHandler {
    (msg:RpStack):void
}

export interface ErrorHandler {
    (msg:string):void
}


interface RunConfig{
    JsonData?:JSON, 
    StringData?:string,
    ObjectData?:object,
    RPStack?: RpStack,
    responseHandler?:ResponseHandler,
    errorHandler?:ErrorHandler,
    full?:boolean
}

interface ConnConfig{
    port:Port, 
    name?:string, 
    responseHandler?:ResponseHandler,
    errorHandler?:ErrorHandler,
    repeat?: boolean,
    upData?: Function
}






export class Connection {




    private port: Port
    private name: string
    public responseHandler: ResponseHandler
    public errorHandler: ErrorHandler
    private repeat: boolean
    private minDelay: number = 2000
    private lastStart: number
    private timer: any
    private lastCfg: RunConfig = {}
    private upData: Function



    
    constructor(cfg:ConnConfig) {

        this.port = cfg.port

        if(cfg.name){    this.name = cfg.name    }
        else{    this.name = ""    }

        if(cfg.responseHandler){this.responseHandler = cfg.responseHandler }
        else{ this.responseHandler = (s:RpStack):void => {} }

        if(cfg.errorHandler){ this.errorHandler = cfg.errorHandler }
        else{ this.errorHandler = (s:string):void => {} }

        if(cfg.repeat){ this.repeat = cfg.repeat }
        else{ this.repeat = false }

        if(cfg.upData){ this.upData = cfg.upData }
        else{ this.upData = ():void => {} }

    }




    public run(cfg:RunConfig){
        /*
            
        */

        //Default values
        let { 
            JsonData = null, 
            ObjectData = null,
            StringData = null,
            RPStack = null,
            responseHandler = null,
            errorHandler = null,
            full = false } = cfg
        
        if(cfg.responseHandler){this.responseHandler = cfg.responseHandler}
        if(cfg.errorHandler){this.errorHandler = cfg.errorHandler}

        let stack = new RpStack()
        let src = createRpSource(Uname, Nname, this.name)
        
        if(this.repeat){
            this.upData()
        }

        if(cfg.ObjectData){
            stack.append(src, cfg.ObjectData)
        }

        let msg = new RpMessage(Uname, Nname, stack)
        const xhr = new XMLHttpRequest()

        xhr.open("POST", this.port, true)
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhr.setRequestHeader("X-XSRFToken", msg.xsrf)
        xhr.onreadystatechange = this.xhrLoad.bind(this, xhr)
        
        try{    clearTimeout(this.timer)    }
        catch{    null    }

        let d = new Date()
        this.lastStart = d.getTime()
        this.lastCfg = cfg

        if(cfg.full){
            xhr.send(msg.toString)
        }
        else{
            xhr.send(JSON.stringify(stack.data(src.id)))
        }
        this.lastCfg.ObjectData = {}
    }




    public pause():void{
        try{    clearTimeout(this.timer)    }
        catch{    null    }
        this.repeat = false        
    }




    public play():void{
        try{    clearTimeout(this.timer)    }
        catch{    null    }
        this.repeat = true
        this.run(this.lastCfg)        
    }




    set objectData(od:object){
        try{    this.lastCfg.ObjectData = od    }
        catch{}

    }




    private xhrLoad(xhr:XMLHttpRequest):void{
        if (xhr.readyState == 4) {

            if(this.repeat){
                let d = new Date()
                let finish = d.getTime()
                let to = (finish - this.lastStart) +500
                if(to < this.minDelay){    to = this.minDelay    }
                this.timer = setTimeout(this.run.bind(this, this.lastCfg), to)
            }


            if (xhr.status == 200) { 
                if(xhr.response){
                    this.responseHandler(parseStack(xhr.response))
                }
            }
            else{
                console.error("[Connection] Error : "+xhr.responseURL+", "+xhr.statusText)
                this.errorHandler(xhr.statusText)
            }
        }

    }



}


/*
    let testStack = new RpStack()

    let test1Source = createRpSource("test1", "ali", "home")
    let test2Source = createRpSource("test2", "ali", "home")
    testStack.append(test1Source, {a: "OK", b:1, c:2})
    testStack.update('alis/home/test1', {a: "NONE", b:3, c:4})
    //log.debug(testStack.data('ali/home/test1'))
    //testStack.delete('ali/home/test1')
    //log.debug(testStack.data('ali/home/test1'))
    testStack.append(test2Source, {data:["NONE", 3, 4]})
    log.debug(this.message, testStack.stack)
    log.debug("", new RpMessage("ali", "admin", testStack).json)
*/