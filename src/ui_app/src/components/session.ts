/*
    The MIT License:

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
*/








import {GDataObject} from "../glider/glider"
import {Port, Connection, ResponseHandler} from "./connection"
import {cookie} from "./cookies"
import {RpStack} from "./msg"








export class SessionUpdater extends GDataObject {
		


    private lastActive:number
    private lastUpdate: number
    private uname: string
    private group: string
    private nodelmt: number
    private interval: number = 10000 
    private timeout:  number = 300000 // = 5 min, it should be same value with server session timeout


    constructor() {
        super()
        let date = new Date()
        let selector = cookie.get("selector")
        this.lastActive = date.getTime()
        this.uname = ""
        if(selector){    this.lastUpdate = this.lastActive    }
        
        document.addEventListener("mousemove", this.awake.bind(this))
        document.addEventListener("keypress", this.awake.bind(this))

        this.upSession()

        setInterval(this.upSession.bind(this), this.interval/2)
    }




    private upSession(){
        
        // Check session cookie
        if(!cookie.get("selector")){    
            this.uname = ""
            return     
        }

        let date = new Date()
        let current = date.getTime()

        // Check Uname
        if(this.uname == ""){    this.getUser()    }

        //There is no update after page load
        if(!this.lastUpdate){  this.lastUpdate = this.lastActive - this.interval  }        

        let inactiveElapsed = current - this.lastActive
        let updateElapsed = current - this.lastUpdate

        //Crack session variable and reload if inactive timeout realese
        /*if(inactiveElapsed > this.timeout){
            console.warn("[Session] Timed out session of "+this.uname)
            cookie.set("validator", "")
            location.reload()
            return
        }*/
        //Near session timeout then update session
        if(updateElapsed > (this.timeout - this.interval) && inactiveElapsed < (this.timeout - this.interval)){
    
            let date = new Date()
            this.lastUpdate = date.getTime()

            let conn = new Connection({
                port:Port.supdate, 
                name:"sessionupdate"})
            conn.run({ObjectData: {}})
        }
    }




    private getUser():void{

        let resp = (stack:RpStack) => {
            if(stack.dataVar("result")){
                this.uname = stack.dataVar("uname")
                this.group = stack.dataVar("ugroup")
                this.nodelmt = stack.dataVar("node_limit")
                console.info("[Session] Hi "+this.uname)
            }
            else{
                console.error("[Session] Username could not loaded")
            }
        }

        let conn = new Connection({
            port:Port.getuser, 
            name:"getuser",
            responseHandler: resp.bind(this)})
        conn.run({ObjectData: {"all":""}})
    }




    get hasSession():boolean{
        if(cookie.get("selector")){    return(true)    }
        else{    return(false)    }
    }




    get user():string{
        return(this.uname)
    }



    get userGroup():string{
        return(this.group)
    }




    get nodeLimit():number{
        return(this.nodelmt)
    }



    awake(e:Event){
        let date = new Date()
        this.lastActive = date.getTime()
    }



    logout():void{
        console.info("[Session] "+this.uname+" logging out.")
        cookie.set("validator", "")
        location.assign("/user/login")
    }

}
