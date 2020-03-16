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








import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import view from "./settings.ghtml"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"









const name = "settings"








export class UserSettings extends GHTMLControl {




	bindingStore:UserSettingsData
    trns: GetText
    _: Function

    userName:HTMLLabelElement
    firstName: HTMLInputElement
    lastName: HTMLInputElement
    descInput: HTMLInputElement
    nodesLink: HTMLLinkElement
    changePassLink: HTMLLinkElement
    sendCodeLink: HTMLLinkElement
    userRemoveLink: HTMLLinkElement
    sendBtnContainer: HTMLElement
    sendButton: SendButton
    codeSendContainer: HTMLElement
    codeSendBtn: SendButton
    removeMsgContainer: HTMLElement
    removeMsg: HTMLLabelElement

    emap: any = [
        [this.nodesLink, "click", this.footernav],
        [this.changePassLink, "click", this.footernav],
        [this.userRemoveLink, "click", this.footernav]
    ]




    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        this.linkEvents(this.emap)
        this.sendButton = new SendButton({
            rootId: this.sendBtnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("sendBtnLabel"),
            sendingMsg: this._("sending"),
            successMsg: this._("updateSuccess"),
            errorMsg: this._("updateError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })
        this.bindingStore.load(this.store("session").user, this.load.bind(this))

        this.codeSendBtn = new SendButton({
            rootId: this.codeSendContainer.id,
            clickCall: this.sendCode.bind(this),
            buttonLabel: this._("SendCodeBtn"),
            sendingMsg: this._("codeSending"),
            successMsg: this._("codeSuccess"),
            errorMsg: this._("codeError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })

    }




    footernav(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.nodesLink:
                this.gDoc.navigate("/"+this.store("session").user)
                break;
            case this.changePassLink:
                this.gDoc.navigate("/user/changepassw")
                break;
            case this.userRemoveLink:
                this.removeMsgContainer.style.visibility = "visible"
        }
    }




    update(e:Event){
        this.bindingStore.save(this.saved.bind(this))
    }




    load():void{
        this.up()
        this.userName.textContent = this.bindingStore.uname
    }




    saved(status:boolean, msg?:string){
        if(status){
            this.sendButton.success()
        }
        else{
            this.sendButton.error()
        }
    }




    sendCode(e:Event){
        this.bindingStore.sendcc(this.sentcc.bind(this))
    }




    sentcc(status:boolean, msg?:string){
        if(status){
            this.codeSendBtn.success()
        }
        else{
            this.codeSendBtn.error()
        }
    }



    input(event:GHTMLInputEvent):void{
        if(event.name == "firstname" && event.value == "remove me"){
            this.firstName.style.color = "red"
            this.sendButton.submit.style.backgroundColor = "red"
        }
        else{
            this.firstName.style.color = ""
            try{this.sendButton.submit.style.backgroundColor = ""}
            catch{    null    }
        }
    }
        
}








export class UserSettingsData extends GDataObject {
	
	
    uname: string = ""
    firstname: string = ""
    lastname: string = ""
    about: string = ""




    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[Settings] User profile could not loaded")
            }
            else{
                this.uname = stack.dataVar("uname")
                this.firstname = stack.dataVar("firstname")
                this.lastname = stack.dataVar("lastname")
                this.about = stack.dataVar("about")
                cb()                
            }
        }

        let conn = new Connection({
            port:Port.getuprf, 
            responseHandler: response.bind(this)})
        conn.run({ObjectData: {}})

    }



    
    save(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {"firstname": this.firstname, "lastname":this.lastname, "about": this.about}

        let conn = new Connection({
            port:Port.upuprf, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }




    sendcc(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let conn = new Connection({
            port:Port.sendcc, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {}})
    }

}
