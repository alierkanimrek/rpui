import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
//import "./login.css"
import signupView from './signup.ghtml'


const name = "signup"











export class Signup extends GHTMLControl {




	bindingStore:SignupData
    trns: GetText
    




    constructor() {
        super({view:signupView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics()        

    }


}




export class SignupData extends GDataObject {
	
	
    uname : string = "admin"
    passw : string = "123456"
    email : string = "Test2"


    uname_valFalMessages:ValFalMessages = {
        valueMissing:"Bu olmadı"
    }



    /*
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
