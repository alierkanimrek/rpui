import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import "./login.css"
import loginView from './login.ghtml'


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



    emap: any = [
        [this.signupLink, "click", this.footer],
        [this.forgotLink, "click", this.footer],
        [this.helpLink, "click", this.footer],
        [this.loginSubmit, "click", this.send]        
    ]




    constructor() {
        super({view:loginView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics()
        this.linkEvents(this.emap)
        this.loginStatus.style.visibility = "hidden"    
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
            console.log("Navigate...")
        }

        if(success){
            this.loginStatusIcon.className = classOk + " has-text-success"
            this.loginMsg.className = " has-text-success"
            this.loginMsg.textContent = this._("loginReady")
            setTimeout(nav.bind(this), 800)
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
            case this.helpLink:
                this.gDoc.navigate("/user/help")
                break;
        }
    }
}








export class LoginData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    remember : boolean = false




    submit(cb:Function):void{

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
    }





}
