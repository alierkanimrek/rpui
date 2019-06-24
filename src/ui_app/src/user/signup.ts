import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
//import "./login.css"
import signupView from './signup.ghtml'


const name = "signup"











export class Signup extends GHTMLControl {




	bindingStore:SignupData
    trns: GetText
    
    signupHelp:HTMLElement
    signupLogin:HTMLElement

    emap: any = [
        [this.signupHelp, "click", this.footer],
        [this.signupLogin, "click", this.footer]
    ]




    constructor() {
        super({view:signupView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics()        
        this.linkEvents(this.emap)        
    }




    footer(e:MouseEvent){
        let t = <HTMLElement>e.target
        if(t == this.signupLogin){
            this.gDoc.navigate("/user/login")
        }
        if(t == this.signupHelp){
            this.gDoc.navigate("/user/help")
        }
    }
}








export class SignupData extends GDataObject {
	
	
    uname : string = ""
    passw : string = ""
    email : string = ""




    /*
 
    uname_valFalMessages:ValFalMessages = {
        valueMissing:"Bu olmadı"
    }

   uname_validation:ValidationRules = {
		required: {required:true, message:"Required"},
		matches: {regex:"regex", equal:"abc", message:"not valid"},
		standard: {standard: "email", message:"not standard"},
		length: {min:8, max:12, message:"min:8 max: 12 char"},
		items: {min:1, max:3, message:"min:1, max:3 items"},
		range: {min:0, max:100, message:"Allowed range is 0-100 "}
    }*/




    input(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

    change(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

}
