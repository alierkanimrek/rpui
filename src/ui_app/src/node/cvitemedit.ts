import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"




const name = "cvitemedit"
const view = `
any
    P
    | Content
`









export class CVItemEdit extends GHTMLControl {




	  bindingStore:CVItemEditData
    _: Function

    




    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        //this.store("base").nname = ""
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()        
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
    }





}








export class CVItemEditData extends GDataObject {
	
	


}
