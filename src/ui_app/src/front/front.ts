import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import View from './front.ghtml'


const name = "front"










export class Front extends GHTMLControl {




	bindingStore:FrontData
    _: Function




    constructor() {
        super({view:View, bindTo:name})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        
    }

}








export class FrontData extends GDataObject {
}
