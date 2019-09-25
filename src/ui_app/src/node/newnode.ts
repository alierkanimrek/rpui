import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"

import view from "./newnode.ghtml"



const name = "newnode"

const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"








export class NewNodeItem extends GHTMLControl {




    bindingStore: NewNodeData
    trns: GetText
    _: Function

    submitStatus: HTMLElement
    submit: HTMLButtonElement
    nname: HTMLInputElement
    submitStatusIcon: HTMLElement
    submitMsg: HTMLElement
    nname_validityMessages:ValidityMessages
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
        this.bindingStore.nname = ""
        this.nname_validityMessages = this.store("trns").getValidityMessages(name, "nname")
        //this.submitStatus.style.visibility = "hidden"
        this.sendButton = new SendButton({
            rootId: this.wgtSendButton.id,
            clickCall: this.create.bind(this),
            buttonLabel: "Create",
            sendingMsg: this._("nnameSending"),
            successMsg: this._("createSuccess"),
            errorMsg: this._("createError"),
        })
    }




    create(e:Event):void{
        if(this.nname.validity.valid){
            this.bindingStore.send(this.createResult.bind(this))
        }
    }




    createResult(stack:RpStack):void{

        let nav = ()=>{
            this.gDoc.navigate(this.uri+"/"+this.bindingStore.nname+"/edit")
        }


        if(stack.dataVar("result")){
            this.sendButton.success(nav.bind(this))
        }
        else{
            this.sendButton.error()
        }
    }

}








export class NewNodeData extends GDataObject {
	
	
    nname: string



    send(responseHandler:ResponseHandler):void{
        
        let data = {"nname": this.nname}

        let conn = new Connection({
            port:Port.newnode, 
            responseHandler:responseHandler})

        conn.run({ObjectData: data})
    }

}
