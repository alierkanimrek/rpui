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




    bindingStore: NewNodeData
    trns: GetText
    _: Function

    submitStatus: HTMLElement
    submit: HTMLButtonElement
    nname: HTMLInputElement
    submitStatusIcon: HTMLElement
    submitMsg: HTMLElement
    nname_validityMessages:ValidityMessages

    emap: any = [
        [this.submit, "click", this.create],
    ]

    uri: string



    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.uri = "/"+this.gDoc.gData("session").user
        this._ = this.trns.get_()
        this.trns.updateStatics()
        this.linkEvents(this.emap)
        this.bindingStore.nname = ""
        this.nname_validityMessages = this.store("trns").getValidityMessages(name, "nname")
        this.submitStatus.style.visibility = "hidden"
    }




    create(e:Event):void{
        if(this.nname.validity.valid){
            this.submit.style.visibility = "hidden"
            this.submit.style.height = "0"
            this.submitStatus.style.visibility = "visible"
            this.submitStatusIcon.className = classSpinnerSpin
            this.submitMsg.textContent = this._("nnameSending")
            this.bindingStore.send(this.createResult.bind(this))
        }
    }




    createResult(stack:RpStack):void{

        let restore = ()=>{
            this.submit.style.visibility = "visible"
            this.submit.style.height = ""
            this.submitStatus.style.visibility = "hidden"
        }

        let nav = ()=>{
            this.gDoc.navigate(this.uri+"/"+this.bindingStore.nname+"/edit")
        }


        if(stack.dataVar("result")){
            this.submitStatusIcon.className = classOk + " has-text-success"
            this.submitMsg.className = " has-text-success"
            this.submitMsg.textContent = this._("createSuccess")
            setTimeout(nav.bind(this), 3000)
        }
        else{
            this.submitStatusIcon.className = classBan + " has-text-danger"
            this.submitMsg.className = " has-text-danger"
            this.submitMsg.textContent = this._("createError")
            setTimeout(restore.bind(this), 1500)
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
