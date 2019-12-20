import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
import {rules} from "../components/rules"

import view from "./newview.ghtml"



const name = "newview"

const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"








export class NewViewItem extends GHTMLControl {




    bindingStore: NewViewData
    trns: GetText
    _: Function

    submitStatus: HTMLElement
    submit: HTMLButtonElement
    vname: HTMLInputElement
    vnameMsg: HTMLElement
    vnameStatus: HTMLElement
    submitStatusIcon: HTMLElement
    submitMsg: HTMLElement
    vname_validityMessages:ValidityMessages
    wgtSendButton: HTMLElement
    sendButton:SendButton

    /*emap: any = [
        [this.submit, "click", this.create],
    ]*/

    uri: string



    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.uri = "/"+this.gDoc.gData("session").user
        this._ = this.trns.get_()
        this.trns.updateStatics()
        //this.linkEvents(this.emap)
        this.bindingStore.vname = ""
        this.vname.pattern = rules.vname
        this.vname_validityMessages = this.store("trns").getValidityMessages(name, "vname")
        //this.submitStatus.style.visibility = "hidden"
        this.sendButton = new SendButton({
            rootId: this.wgtSendButton.id,
            clickCall: this.create.bind(this),
            buttonLabel: this._("buttonLabel"),
            sendingMsg: this._("vnameSending"),
            successMsg: this._("createSuccess"),
            errorMsg: this._("createError"),
            disabled: true,
            classx: "button is-block is-info is-fullwidth is-medium"
        })
    }




    create(e:Event):void{
        if(this.vname.validity.valid){
            this.bindingStore.send(this.createResult.bind(this))
        }
    }




    createResult(stack:RpStack):void{

        let nav = ()=>{
            this.store("base").vname = this.bindingStore.vname
            this.gDoc.navigate(this.uri+"/"+this.bindingStore.vname+"/edit")
        }


        if(stack.dataVar("result")){
            this.sendButton.success(nav.bind(this))
        }
        else{
            this.sendButton.error()
        }
    }



    input(event:GHTMLInputEvent):void{
        if(this.vname.validity.valid){
            this.vnameStatus.className = classOk
            this.vnameMsg.innerText = ""
            this.sendButton.disabled = false
        }
        else{
            this.vnameStatus.className = classBan
            this.vnameMsg.innerText = this.vname.validationMessage
            this.sendButton.disabled = true
        }

    }

}








export class NewViewData extends GDataObject {
	
	
    vname: string



    send(responseHandler:ResponseHandler):void{
        
        let data = {"vname": this.vname}

        let conn = new Connection({
            port:Port.newview,
            responseHandler:responseHandler})

        conn.run({ObjectData: data})
    }

}
