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
    login:HTMLElement


    emap: any = [
        [this.help, "click", this.footerNav],
        [this.login, "click", this.footerNav],
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

    }




    footerNav(e:MouseEvent){
        let t = <HTMLElement>e.target
        if(t == this.login){
            this.gDoc.navigate("/user/login")
        }
        if(t == this.help){
            this.gDoc.navigate("/user/help")
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

        let restore = ()=>{
            this.submit.style.visibility = "visible"
            this.submit.style.height = ""
            this.submitStatus.style.visibility = "hidden"                        
        }

        let nav = ()=>{
            console.log("Navigate...")
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