import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import {GetText} from "../i18n/gettext"
//import "./login.css"
import forgotView from './forgot.ghtml'


const name = "forgot"











export class Forgot extends GHTMLControl {




	bindingStore:ForgotData
    trns: GetText

    mailContainer: HTMLElement
    codeContainer: HTMLElement
    helplink:HTMLElement
    loginlink:HTMLElement

    emap: any = [
        [this.helplink, "click", this.footer],
        [this.loginlink, "click", this.footer]
    ]



    constructor() {
        super({view:forgotView, bindTo:name})
        this.codeContainer.style.display = "none"
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics(this)
        this.linkEvents(this.emap)    

    }




    footer(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.loginlink:
                this.gDoc.navigate("/user/login")
                break;
            case this.helplink:
                this.gDoc.navigate("/user/help")
                break;
        }
    }
}








export class ForgotData extends GDataObject {
	
	
    email : string
    code : string 


}
