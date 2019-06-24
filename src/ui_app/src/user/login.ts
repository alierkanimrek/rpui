import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import "./login.css"
import loginView from './login.ghtml'


const name = "login"











export class Login extends GHTMLControl {




	bindingStore:LoginData
    trns: GetText

    signupLink:HTMLElement
    forgotLink:HTMLElement
    helpLink:HTMLElement

    emap: any = [
        [this.signupLink, "click", this.footer],
        [this.forgotLink, "click", this.footer],
        [this.helpLink, "click", this.footer]
    ]




    constructor() {
        super({view:loginView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics()
        this.linkEvents(this.emap)    
        /*
        let select = [
            "selectArea",
            "  select id=server name=server"
        ]

        this.bindingStore.servers.forEach((s:string)=>{
            select.push("    option")
            select.push(`    ^ ${s}`)
        })

        this.createGHTML(select)
        this.up()
        */
        //this.e["submit"].addEventListener("click", this.submit.bind(this))

    }

    /*
    submit(e:Event){
        console.log(this.bindingStore)
        //window.location.hash = "/test"
    }
    */

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
    remember : boolean = true


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
