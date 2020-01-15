import {GDataObject} from "../glider/glider"
import {Port, Connection, ResponseHandler} from "../components/connection"
import {cookie} from "../components/cookies"
import {RpStack} from "../components/msg"









export class SessionUpdater extends GDataObject {
		


    private lastActive:number
    private lastUpdate: number
    private uname: string
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
        conn.run({ObjectData: {}})
    }




    get hasSession():boolean{
        if(cookie.get("selector")){    return(true)    }
        else{    return(false)    }
    }




    get user():string{
        return(this.uname)
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
