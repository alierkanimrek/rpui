import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import view from "./nodeedit.ghtml"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"


const name = "nodeedit"



/*
                  div class=columns is-gapless is-mobile
                    div class=column
                      span class=icon is-small is-info
                        i class=fas fa-caret-left aria-hidden=true
                    div class=column
                      span gid=access class=is-info
                    div class=column
                      span class=icon is-small is-info
                        i class=fas fa-caret-right aria-hidden=true
*/





export class NodeEdit extends GHTMLControl {




	bindingStore:NodeEditData
    trns: GetText
    _: Function

    sendBtnContainer: HTMLElement
    sendButton:SendButton
    access:HTMLElement

    /*emap: any = [
        [this.signupLink, "click", this.footer],
    ]*/




    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        //this.linkEvents(this.emap)
        this.sendButton = new SendButton({
            rootId: this.sendBtnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("sendBtnLabel"),
            sendingMsg: this._("sending"),
            successMsg: this._("updateSuccess"),
            errorMsg: this._("updateError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })
        
    }



    update(e:Event){
        console.log(this.bindingStore)
    }



}








export class NodeEditData extends GDataObject {
	
	
    desc: string
    access: string


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
