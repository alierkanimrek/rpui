import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler} from "../components/connection"
import {RpMessage} from "../components/msg"
//import "./login.css"
import signupView from './signup.ghtml'








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








interface CheckCallback {
    // status = false // It's not found
    // status = true  // It has
    (status:boolean):void
}








export class SignupData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    email : string = ""

    inputInterval:number = 800




    checkEmail(getStatus:CheckCallback):void{
        
        let response:ResponseHandler = (msg:RpMessage) => {
            getStatus(true)
        }

        let data = {"type":"email", "data":this.email}
        let conn = new Connection({
            port:Port.check, 
            name:name, 
            responseHandler:response.bind(this)})
        conn.run({ObjectData: data})
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



/*
        let testStack = new RpStack()

        let test1Source = createRpSource("test1", "ali", "home")
        let test2Source = createRpSource("test2", "ali", "home")
        testStack.append(test1Source, {a: "OK", b:1, c:2})
        testStack.update('alis/home/test1', {a: "NONE", b:3, c:4})
        //log.debug(testStack.data('ali/home/test1'))
        //testStack.delete('ali/home/test1')
        //log.debug(testStack.data('ali/home/test1'))
        testStack.append(test2Source, {data:["NONE", 3, 4]})
        log.debug(this.message, testStack.stack)
        log.debug("", new RpMessage("ali", "admin", testStack).json)
*/