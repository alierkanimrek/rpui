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
import view from './changepassw.ghtml'


const name = "changepassw"









const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"
const classEyeSlash = "far fa-eye-slash"
const classEye = "far fa-eye"








export class ChangePassw extends GHTMLControl {




	bindingStore:ChangePasswData
    trns: GetText
    _: Function

    passwInput:HTMLInputElement
    submit:HTMLButtonElement
    submitStatus:HTMLElement
    submitMsg:HTMLElement
    submitStatusIcon:HTMLElement
    passwHideBtn:HTMLElement
    passwStatus:HTMLElement
    passwMsg:HTMLElement
    help:HTMLElement
    settings:HTMLElement
    nodes:HTMLElement


    emap: any = [
        [this.settings, "click", this.footerNav],
        [this.nodes, "click", this.footerNav],
        [this.passwHideBtn, "click", this.passwHideSw],
        [this.submit, "click", this.send]
    ]

    passw_validityMessages:ValidityMessages





    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics(this)        
        this.linkEvents(this.emap)
        
        this._ = this.trns.get_()

        this.passw_validityMessages = this.store("trns").getValidityMessages(name, "passw")

        this.submitStatus.style.visibility = "hidden"

        this.bindingStore.passw = ""
        this.up()

    }




    footerNav(e:MouseEvent){
        let t = <HTMLElement>e.target
        if(t == this.settings){
            this.gDoc.navigate("/user/settings")
        }
        if(t == this.nodes){
            this.gDoc.navigate("/"+this.store("session").user)
        }
    }




    input(event:GHTMLInputEvent):void{
        /*
            Form input controls
        */

        if(this.passwInput.validity.valid){
            this.passwStatus.className = classOk
        }
        else{
            this.passwStatus.className = classBan
        }
        this.passwMsg.innerText = this.passwInput.validationMessage
    }




    passwHideSw(e:MouseEvent){
        if(this.passwHideBtn.className == classEye){
            this.passwHideBtn.className = classEyeSlash
            this.passwInput.type = "password"
        }
        else{
            this.passwHideBtn.className = classEye
            this.passwInput.type = "text"
        }
    }




    send(e:Event){
        if(this.passwInput.validity.valid){

            this.submit.style.visibility = "hidden"
            this.submit.style.height = "0"
            this.submitStatus.style.visibility = "visible"
            this.submitMsg.textContent = this._("submitMsg")
            
            this.bindingStore.submit(this.submitResult.bind(this))
        }
    }




    submitResult(success:boolean){

        this.up()

        let restore = ()=>{
            this.submit.style.visibility = "visible"
            this.submit.style.height = ""
            this.submitStatus.style.visibility = "hidden"                        
        }

        let nav = ()=>{
            this.gDoc.navigate("/user/login")
        }

        if(success){
            this.submitStatusIcon.className = classOk + " has-text-success"
            this.submitMsg.className = " has-text-success"
            this.submitMsg.innerHTML = this._("submitReady")
            setTimeout(nav.bind(this), 1500)
        }
        else{
            this.submitStatusIcon.className = classBan + " has-text-danger"
            this.submitMsg.className = " has-text-danger"
            this.submitMsg.textContent = this._("submitError")
            setTimeout(restore.bind(this), 3000)
        }
    }


}















export class ChangePasswData extends GDataObject {
	
	
    passw : string = ""





    submit(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false)    
        }


        let data = {"passw":this.passw}

        let conn = new Connection({
            port:Port.uchpassw, 
            name:name, 
            responseHandler:response,
            errorHandler: error})

        conn.run({ObjectData: data})
        
        this.passw = ""
    }


}