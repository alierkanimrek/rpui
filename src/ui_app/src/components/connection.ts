import {RpMessage, RpStack, createRpMessage, createRpStack, parseStack} from "./msg"
import {createRpSource} from "./source"









const Uname = "root"
const Nname = "web"
const Name = ""


export enum Port{
    "ucheck" = "/xhr/ucheck",
    "ucreate" = "/xhr/ucreate"
}

export interface ResponseHandler {
    (msg:RpStack):void
}

interface RunConfig{
    JsonData?:JSON, 
    StringData?:string,
    ObjectData?:object,
    RPStack?: RpStack,
    responseHandler?:ResponseHandler,
    full?:boolean
}

interface ConnConfig{
    port:Port, 
    name?:string, 
    responseHandler?:ResponseHandler
}






export class Connection {




    private port: Port
    private name: string
    public responseHandler: ResponseHandler



    
    constructor(cfg:ConnConfig) {

        //Default values
        let { 
            port="", 
            name="", 
            responseHandler=(s:RpStack):void => {} } = cfg
        
        this.port = cfg.port
        this.name = cfg.name
        this.responseHandler = cfg.responseHandler

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
            full = false } = cfg
        
        if(cfg.responseHandler){this.responseHandler = cfg.responseHandler}
        
        let stack = new RpStack()
        let src = createRpSource(Uname, Nname, this.name)
        
        if(cfg.ObjectData){
            stack.append(src, cfg.ObjectData)
        }

        let msg = new RpMessage(Uname, Nname, stack)
        const xhr = new XMLHttpRequest()

        xhr.open("POST", this.port, true)
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhr.setRequestHeader("X-XSRFToken", msg.xsrf)
        xhr.onreadystatechange = this.xhrLoad.bind(this, xhr)
        if(cfg.full){
            xhr.send(msg.toString)
        }
        else{
            xhr.send(JSON.stringify(stack.data(src.id)))
        }
    }




    private xhrLoad(xhr:XMLHttpRequest):void{
        if (xhr.readyState == 4) {
            if (xhr.status == 200) { 
                this.responseHandler(parseStack(xhr.response))
            }
            else{
                console.error("[Connection] Error : "+xhr.responseURL+", "+xhr.statusText)
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