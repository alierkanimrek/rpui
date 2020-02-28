import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import View from './front.ghtml'
import {Switch} from "../widgets/elements/switch"

const name = "front"










export class Front extends GHTMLControl {




	bindingStore:FrontData
    _: Function
    sw_server:Switch
    sw_signup:Switch




    constructor() {
        super({view:View, bindTo:name})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.sw_server = new Switch(this.e.serverstatus.id)
        this.sw_signup = new Switch(this.e.signupstatus.id)
        this.bindingStore.checkStatus(this.status.bind(this))
    }



    status(status:any){
        this.sw_server.checked = status["server"]
        this.sw_signup.checked = status["signup"]
        this.sw_server.freeze = true
        this.sw_signup.freeze = true
    }

}









export class FrontData extends GDataObject {




    checkStatus(getStatus:Function):void{
        
        let response:ResponseHandler = (stack:RpStack) => {
            getStatus(stack.dataVar("status"))    
        }

        let conn = new Connection({
            port:Port.getst, 
            name:name, 
            responseHandler:response})
        conn.run({ObjectData: {}})
    }
}
