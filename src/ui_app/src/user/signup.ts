import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
//import "./login.css"
import signupView from './signup.ghtml'


const name = "signup"

const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
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

    emap: any = [
        [this.elm.help, "click", this.footerNav],
        [this.elm.login, "click", this.footerNav]
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
    }





    footerNav(e:MouseEvent){
        let t = <HTMLElement>e.target
        if(t == this.elm.login){
            this.gDoc.navigate("/user/login")
        }
        if(t == this.elm.help){
            this.gDoc.navigate("/user/help")
        }
    }




    input(event:GHTMLInputEvent):void{
        switch (event.name) {
            case "email":
                if(this.emailInput.validity.valid && !this.bindingStore.checkEmail()){
                    this.emailInput.setCustomValidity(this._("email_customError"))
                }
                this.elm.emailMsg.innerText = this.emailInput.validationMessage
                break;
            case "passw":
                if(this.passwInput.validity.valid && !this.bindingStore.checkPassw()){
                    this.passwInput.setCustomValidity(this._("passw_customError"))
                }
                this.elm.passwMsg.innerText = this.passwInput.validationMessage
                break;
            case "uname":
                this.elm.unameMsg.innerText = this.unameInput.validationMessage
                break;
        }
    }






}








export class SignupData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    email : string = ""

    inputInterval:number = 800




    checkEmail():boolean{
        return(false)
    }




    checkPassw():boolean{
        return(false)
    }




    checkUname():boolean{
        return(false)
    }




    change(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

}
