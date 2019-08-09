import {Port, Connection} from "../components/connection"
import {cookie} from "../components/cookies"









export class SessionUpdater {
		


    lastActive:number
    lastUpdate: number
    interval: number = 10000 
    timeout:  number = 300000 // = 5 min, it should be same value with server session timeout


    constructor() {
        
        let date = new Date()
        let selector = cookie.get("selector")
        this.lastActive = date.getTime()
        if(selector){    this.lastUpdate = this.lastActive    }
        
        document.addEventListener("mousemove", this.awake.bind(this))
        document.addEventListener("keypress", this.awake.bind(this))

        setInterval(this.up.bind(this), this.interval)
    }




    up(){
        
        // Check session cookie
        if(!cookie.get("selector")){    return    }

        let date = new Date()
        let current = date.getTime()

        //There is no update after page load
        if(!this.lastUpdate){  this.lastUpdate = this.lastActive - this.interval  }        

        let inactiveElapsed = current - this.lastActive
        let updateElapsed = current - this.lastUpdate

        //Crack session variable and reload if inactive timeout realese
        if(inactiveElapsed > this.timeout){
            cookie.set("validator", "")
            location.reload()
            return
        }

        //Near session timeout then update session
        if(updateElapsed > (this.timeout - this.interval)){
    
            let date = new Date()
            this.lastUpdate = date.getTime()

            let conn = new Connection({
                port:Port.supdate, 
                name:"sessionupdate"})
            conn.run({ObjectData: {}})
        }
    }




    awake(e:Event){
        let date = new Date()
        this.lastActive = date.getTime()
    }


}
