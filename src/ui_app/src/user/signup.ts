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
import {Port, Connection, ResponseHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import signupView from './signup.ghtml'
import {oauth} from "../components/oauth"








const name = "signup"

const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"
const classEyeSlash = "far fa-eye-slash"
const classEye = "far fa-eye"








export class Signup extends GHTMLControl {




	bindingStore:SignupData
    elm: any = this
    trns: GetText
    _: Function

    emailInput:HTMLInputElement
    unameInput:HTMLInputElement
    passwInput:HTMLInputElement
    form:HTMLFormElement
    blockmsg:HTMLElement

    emap: any = [
        [this.elm.login, "click", this.footerNav],
        [this.elm.passwHideBtn, "click", this.passwHideSw],
        [this.elm.submit, "click", this.send],
        [this.e["gsignup"], "click", this.gAuth]
    ]

    email_validityMessages:ValidityMessages
    uname_validityMessages:ValidityMessages
    passw_validityMessages:ValidityMessages





    constructor() {
        super({view:signupView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics(this)        
        this.linkEvents(this.emap)
        
        this._ = this.trns.get_()

        //this.email_validityMessages.typeMismatch = _("email_typeMismatch")
        this.email_validityMessages = this.store("trns").getValidityMessages(name, "email")
        this.uname_validityMessages = this.store("trns").getValidityMessages(name, "uname")
        this.passw_validityMessages = this.store("trns").getValidityMessages(name, "passw")

        this.elm.submitStatus.style.visibility = "hidden"

        this.checkSignup()

        oauth.init()
    }




    gAuth(e:Event){
        oauth.authorize(this.gAuthResponse.bind(this))
    }




    gAuthResponse(resp:any){
        if(resp.error){    
            console.log("Auth error")
            return
        }
        this.bindingStore.gAuthToken = resp.getAuthResponse().id_token
        this.elm.submit.style.visibility = "hidden"
        this.elm.submit.style.height = "0"
        this.elm.submitStatus.style.visibility = "visible"
        this.elm.submitMsg.textContent = this._("submitMsg")
        this.bindingStore.submit(this.submitResult.bind(this))
    }




    checkSignup():void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(!stack.dataVar("result")){
                //this.form.style.visibility = "hidden"
                //this.form.style.height = "0"
                this.blockmsg.style.visibility = "visible"
                this.blockmsg.style.height = ""
            }
        }


        let conn = new Connection({
            port:Port.chksup, 
            name:name, 
            responseHandler:response})

        conn.run({ObjectData: {}})
    }




    footerNav(e:MouseEvent){
        let t = <HTMLElement>e.target
        if(t == this.elm.login){
            this.gDoc.navigate("/user/login")
        }
        if(t == this.elm.help){
            this.gDoc.navigate("/heap/help.html")
        }
    }




    input(event:GHTMLInputEvent):void{
        /*
            Form input controls
        */
        let emailCheckResult:CheckCallback = (status:boolean)=>{

            if(status){
                // Not valid
                if(this.emailInput.validity.valid){
                    // It has at server
                    this.emailInput.setCustomValidity(this._("email_customError"))
                }
                this.elm.emailStatus.className = classBan
            }
            else{
                this.elm.emailStatus.className = classOk
            }
            // Show message
            this.elm.emailMsg.innerText = this.emailInput.validationMessage
        }


        let unameCheckResult:CheckCallback = (status:boolean)=>{
            
            if(status){
                // Not valid
                if(this.unameInput.validity.valid){
                    // It has at server
                    this.unameInput.setCustomValidity(this._("uname_customError"))
                }
                this.elm.unameStatus.className = classBan
                this.elm.gsignup.style.visibility = "hidden"
                this.elm.gsignup.style.height = "0"
            }
            else{
                this.elm.unameStatus.className = classOk
                this.elm.gsignup.style.visibility = "visible"
                this.elm.gsignup.style.height = ""
            }
            // Show message
            this.elm.unameMsg.innerText = this.unameInput.validationMessage
        }


        // Form control selector
        switch (event.name) {
            
            case "email":
                if(this.emailInput.validity.valid){
                    // Check from server
                    this.elm.emailStatus.className = classSpinnerSpin
                    this.bindingStore.checkEmail(emailCheckResult)
                }
                else{
                    emailCheckResult(true)
                }
                break;
            
            case "passw":
                if(this.passwInput.validity.valid){
                    this.elm.passwStatus.className = classOk
                }
                else{
                    this.elm.passwStatus.className = classBan
                }
                this.elm.passwMsg.innerText = this.passwInput.validationMessage
                break;

            case "uname":
                if(this.unameInput.validity.valid){
                    // Check from server
                    this.elm.unameStatus.className = classSpinnerSpin
                    this.bindingStore.checkUname(unameCheckResult)
                }
                else{
                    unameCheckResult(true)
                }
                break;
        }
    }




    passwHideSw(e:MouseEvent){
        if(this.elm.passwHideBtn.className == classEye){
            this.elm.passwHideBtn.className = classEyeSlash
            this.passwInput.type = "password"
        }
        else{
            this.elm.passwHideBtn.className = classEye
            this.passwInput.type = "text"
        }
    }




    send(e:Event){
        if(this.unameInput.validity.valid && 
            this.passwInput.validity.valid &&
            this.emailInput.validity.valid){

            this.elm.submit.style.visibility = "hidden"
            this.elm.submit.style.height = "0"
            this.elm.submitStatus.style.visibility = "visible"
            this.elm.submitMsg.textContent = this._("submitMsg")
            
            this.bindingStore.submit(this.submitResult.bind(this))
        }
    }




    submitResult(success:boolean){
        this.bindingStore.gAuthToken = ""
        let restore = ()=>{
            this.elm.submit.style.visibility = "visible"
            this.elm.submit.style.height = ""
            this.elm.submitStatus.style.visibility = "hidden"                        
        }

        let nav = ()=>{
            this.gDoc.navigate("/"+this.bindingStore.uname)
        }

        if(success){
            this.elm.submitStatusIcon.className = classOk + " has-text-success"
            this.elm.submitMsg.className = " has-text-success"
            this.elm.submitMsg.textContent = this._("submitReady")
            setTimeout(nav.bind(this), 1500)
        }
        else{
            this.elm.submitStatusIcon.className = classBan + " has-text-danger"
            this.elm.submitMsg.className = " has-text-danger"
            this.elm.submitMsg.textContent = this._("submitError")
            setTimeout(restore.bind(this), 3000)
        }
    }


}








interface CheckCallback {
    // status = false // It's not found
    // status = true  // It has
    (status:boolean):void
}








export class SignupData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    email : string = ""
    gAuthToken : string = ""



    checkEmail(getStatus:CheckCallback):void{
        
        let response:ResponseHandler = (stack:RpStack) => {
            getStatus(stack.dataVar("result"))    
        }
        
        let data = {"type":"email", "data":this.email}
        this.check(data, response.bind(this))
    }




    checkUname(getStatus:CheckCallback):void{
        
        let response:ResponseHandler = (stack:RpStack) => {
            getStatus(stack.dataVar("result"))    
        }

        let data = {"type":"uname", "data":this.uname}
        this.check(data, response.bind(this))
    }




    private check(data: any, cb: ResponseHandler):void{
        let conn = new Connection({
            port:Port.ucheck, 
            name:name, 
            responseHandler:cb})
        conn.run({ObjectData: data})
    }




    checkPassw():boolean{
        return(false)
    }




    submit(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let data = {"uname": this.uname, "email":this.email, "passw":this.passw, "gAuthToken": this.gAuthToken}

        let conn = new Connection({
            port:Port.ucreate, 
            name:name, 
            responseHandler:response})

        conn.run({ObjectData: data})
     
    }

}



