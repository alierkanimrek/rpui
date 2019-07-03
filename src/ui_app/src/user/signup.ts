import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../glider/glider"
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
    trns: GetText
    
    help:HTMLElement
    login:HTMLElement
    emailInput:HTMLInputElement


    emap: any = [
        [this.help, "click", this.footerNav],
        [this.login, "click", this.footerNav]
    ]




    constructor() {
        super({view:signupView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics(this)        
        this.linkEvents(this.emap)        
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
        switch (event.name) {
            case "email":
                this.checkEmail()
                break;
            case "passw":
                this.checkPassw()
                break;
            case "uname":
                this.checkUname()
                break;
        }
    }





    checkEmail():void{
        console.log(this.emailInput)
    }




    checkPassw():void{
        console.log(this.bindingStore.passw)
    }



    checkUname():void{
        console.log(this.bindingStore.uname)
    }


}








export class SignupData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    email : string = ""

    inputInterval:number = 800

    uname_valFalMessages:ValFalMessages = {
        valueMissing:"Bu olmadı"
    }



    change(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

}
