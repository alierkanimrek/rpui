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

    title:HTMLElement
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
        if(this.store("base").nname == ""){
            this.store("base").getNNameFromUri(this.gDoc.path)
        }
        this.bindingStore.load(this.store("base").nname, this.load.bind(this))

    }



    update(e:Event){
        console.log(this.bindingStore)
    }




    load():void{
        this.up()
        let t = this.bindingStore.title
        let title = t.charAt(0).toUpperCase() + t.substring(1)
        this.title.textContent = title
    }

}








export class NodeEditData extends GDataObject {
	
	
    title: string
    desc: string
    access: string


    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(!stack.dataVar("result")){
                this.title = stack.stack[0].data.nname
                this.desc = stack.stack[0].data.desc
                cb()
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let data = {"nname": nname}

        let conn = new Connection({
            port:Port.getnode, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }

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
