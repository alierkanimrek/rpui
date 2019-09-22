import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"

import view from "./newnode.ghtml"



const name = "newnode"

const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"








export class NewNodeItem extends GHTMLControl {




    trns: GetText
    _: Function

    submitStatus: HTMLElement

    /*emap: any = [
        [this.signupLink, "click", this.footer],
    ]*/




    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        //this.trns = this.store("trns").t.translations(name)
        //this._ = this.trns.get_()
        //this.trns.updateStatics()
        //this.linkEvents(this.emap)

        this.submitStatus.style.visibility = "hidden"
    }



}








export class NewNodeData extends GDataObject {
	
	
    nname: string



    /*submit(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {"uname": this.uname, "passw":this.passw, "remember": this.remember}

        let conn = new Connection({
            port:Port.ulogin, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }*/

}
