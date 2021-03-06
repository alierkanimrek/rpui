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
import forgotView from './forgot.ghtml'


const name = "forgot"




const classSpinnerSpin = "fas fa-spinner fa-spin"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"





export class Forgot extends GHTMLControl {




	bindingStore:ForgotData
    trns: GetText
    _: Function

    mailContainer: HTMLElement
    codeContainer: HTMLElement
    helplink:HTMLElement
    loginlink:HTMLElement
    mailinput:HTMLInputElement
    mailmsg:HTMLElement
    mailsend:HTMLInputElement
    mailStatus:HTMLElement
    mailStatusIcon:HTMLElement
    mailStatusMsg:HTMLElement
    resend: HTMLElement
    codeinput: HTMLInputElement
    codesend: HTMLInputElement
    codemsg: HTMLElement
    codeStatus:HTMLElement
    codeStatusIcon:HTMLElement
    codeStatusMsg:HTMLElement

    email_validityMessages:ValidityMessages

    emap: any = [
        [this.loginlink, "click", this.footer],
        [this.mailsend, "click", this.sendmail],
        [this.resend, "click", this.showMailInput],
        [this.codesend, "click", this.sendcode],
    ]



    constructor() {
        super({view:forgotView, bindTo:name})
        this.codeContainer.style.display = "none"
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        this.linkEvents(this.emap)    
        this.email_validityMessages = this.store("trns").getValidityMessages(name, "email")
        this.mailStatus.style.visibility = "hidden"
        this.codeStatus.style.visibility = "hidden"
        this.bindingStore.code = ""
        this.bindingStore.email = ""
        this.up()


    }


    input(event:GHTMLInputEvent):void{
        if(event.name == "email"){
            this.mailmsg.innerText = this.mailinput.validationMessage
        }

    }




    sendmail(e:Event){
        if(this.mailinput.validity.valid){
            this.mailsend.style.visibility = "hidden"
            this.mailsend.style.height = "0"
            this.mailStatus.style.visibility = "visible"
            this.mailStatusIcon.className = classSpinnerSpin
            this.mailStatusMsg.textContent = this._("mailsending")
            this.bindingStore.sendmail(this.mailSendResult.bind(this))
        }
    }




    mailSendResult(stack:RpStack){

        let restore = ()=>{
            this.mailsend.style.visibility = "visible"
            this.mailsend.style.height = ""
            this.mailStatus.style.visibility = "hidden"
        }


        if(stack.dataVar("result")){
            restore.bind(this)
            this.mailContainer.style.display = "none"
            this.codeContainer.style.display = "block"
        }
        else{
            this.mailStatusIcon.className = classBan + " has-text-danger"
            this.mailStatusMsg.className = " has-text-danger"
            this.mailStatusMsg.textContent = this._("mailnotfound")
            setTimeout(restore.bind(this), 3000)
        }
    }



    showMailInput(e:Event){
        this.mailContainer.style.display = "block"
        this.codeContainer.style.display = "none"
        this.mailsend.style.visibility = "visible"
        this.mailsend.style.height = ""
        this.mailStatus.style.visibility = "hidden"

    }




    sendcode(e:Event){
        if(this.codeinput.validity.valid){
            this.codesend.style.visibility = "hidden"
            this.codesend.style.height = "0"
            this.codeStatus.style.visibility = "visible"
            this.codeStatusIcon.className = classSpinnerSpin
            this.codeStatusMsg.textContent = this._("codesending")
            this.bindingStore.sendcode(this.codeSendResult.bind(this))
        }
    }



    codeSendResult(stack:RpStack){

        this.up()

        let restore = ()=>{
            this.codesend.style.visibility = "visible"
            this.codesend.style.height = ""
            this.codeStatus.style.visibility = "hidden"
        }

        let nav = ()=>{
            this.gDoc.navigate("/user/changepassw")
        }


        if(stack.dataVar("result")){
            this.codeStatusIcon.className = classOk + " has-text-success"
            this.codeStatusMsg.className = " has-text-success"
            this.codeStatusMsg.textContent = this._("codeverified")
            this.resend.style.visibility = "hidden"
            setTimeout(nav.bind(this), 3000)
        }
        else{
            this.codeStatusIcon.className = classBan + " has-text-danger"
            this.codeStatusMsg.className = " has-text-danger"
            this.codeStatusMsg.textContent = this._("codenotverified")
            setTimeout(restore.bind(this), 1500)
        }

    }



    footer(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.loginlink:
                this.gDoc.navigate("/user/login")
                break;
        }
    }
}








export class ForgotData extends GDataObject {
	
	
    email : string = ""
    code : string = ""



    sendmail(responseHandler:ResponseHandler):void{
        
        let data = {"email": this.email}

        let conn = new Connection({
            port:Port.uforgot, 
            name:name, 
            responseHandler:responseHandler})

        conn.run({ObjectData: data})

        this.code = ""
    }


    sendcode(responseHandler:ResponseHandler):void{

        let data = {"email": this.email, "code": this.code}

        let conn = new Connection({
            port:Port.usendcode, 
            name:name, 
            responseHandler:responseHandler})

        conn.run({ObjectData: data})

        this.code = ""
    }

        



}
