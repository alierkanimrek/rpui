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
import "./login.css"
import loginView from './login.ghtml'
import {oauth} from "../components/oauth"


const name = "login"





const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"
const classEyeSlash = "far fa-eye-slash"
const classEye = "far fa-eye"





export class Login extends GHTMLControl {




	bindingStore:LoginData
    trns: GetText
    _: Function

    signupLink:HTMLElement
    forgotLink:HTMLElement
    helpLink:HTMLElement
    loginSubmit:HTMLElement
    loginUname: HTMLInputElement
    loginPassw: HTMLInputElement
    loginStatus: HTMLElement
    loginMsg: HTMLElement
    loginStatusIcon: HTMLElement
    gsignin: HTMLElement



    emap: any = [
        [this.signupLink, "click", this.footer],
        [this.forgotLink, "click", this.footer],
        [this.loginSubmit, "click", this.send],
        [this.loginUname, "keyup", this.keyInput],
        [this.loginPassw, "keyup", this.keyInput],
        [this.e["gsignin"], "click", this.gAuth]
    ]




    constructor() {
        super({view:loginView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        this.linkEvents(this.emap)
        this.loginStatus.style.visibility = "hidden"

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
        this.loginSubmit.style.visibility = "hidden"
        this.loginSubmit.style.height = "0"
        this.loginStatus.style.visibility = "visible"
        this.loginMsg.textContent = this._("loginMsg")
        this.loginStatusIcon.className = classSpinnerSpin
        this.bindingStore.submit(this.loginResult.bind(this))
    }




    keyInput(e:KeyboardEvent){
        if(e.keyCode == 13){
            //Enter
            this.send(e)
        }
    }




    send(e:Event){
        if(this.loginUname.validity.valid && this.loginPassw.validity.valid){
            this.loginSubmit.style.visibility = "hidden"
            this.loginSubmit.style.height = "0"
            this.loginStatus.style.visibility = "visible"
            this.loginMsg.textContent = this._("loginMsg")
            this.loginStatusIcon.className = classSpinnerSpin
            
            this.bindingStore.submit(this.loginResult.bind(this))

        }
    }




    loginResult(success:boolean, msg?:string){

        let restore = ()=>{
            this.loginSubmit.style.visibility = "visible"
            this.loginSubmit.style.height = ""
            this.loginStatus.style.visibility = "hidden"                        
        }

        let nav = ()=>{
            location.href = "/"+this.store("session").user
            
        }

        if(success){
            this.loginStatusIcon.className = classOk + " has-text-success"
            this.loginMsg.className = " has-text-success"
            this.loginMsg.textContent = this._("loginReady")
            this.store("session").getUser()
            setTimeout(nav.bind(this), 500)
        }
        else{
            this.loginStatusIcon.className = classBan + " has-text-danger"
            this.loginMsg.className = " has-text-danger"
            if(msg){    this.loginMsg.textContent = msg    }
            else{    this.loginMsg.textContent = this._("loginError")   }
            setTimeout(restore.bind(this), 1500)
        }
    }



    footer(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.signupLink:
                this.gDoc.navigate("/user/signup")
                break;
            case this.forgotLink:
                this.gDoc.navigate("/user/forgotpassw")
                break;
        }
    }
}








export class LoginData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    remember : boolean = false
    gAuthToken:string = ""



    submit(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {"uname": this.uname, "passw":this.passw, "remember": this.remember, "gAuthToken": this.gAuthToken}

        let conn = new Connection({
            port:Port.ulogin, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }





}
