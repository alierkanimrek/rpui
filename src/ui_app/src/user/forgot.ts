import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import {GetText} from "../i18n/gettext"
//import "./login.css"
import forgotView from './forgot.ghtml'


const name = "forgot"











export class Forgot extends GHTMLControl {




	bindingStore:ForgotData
    trns: GetText

    helpLink:HTMLElement
    loginLink:HTMLElement

    emap: any = [
        [this.helpLink, "click", this.footer],
        [this.loginLink, "click", this.footer]
    ]



    constructor() {
        super({view:forgotView, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this.trns.updateStatics()
        this.linkEvents(this.emap)    

    }




    footer(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.loginLink:
                this.gDoc.navigate("/user/login")
                break;
            case this.helpLink:
                this.gDoc.navigate("/user/help")
                break;
        }
    }
}








export class ForgotData extends GDataObject {
	
	
    emailuname : string = "admin"


}
