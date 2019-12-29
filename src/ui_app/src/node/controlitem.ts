import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"

import view from "./controlitem.ghtml"

import {CVItemEdit} from "./cvitemedit"






const name = "controlitem"










export class ControlItem extends GHTMLControl {




	bindingStore:ControlItemData
    trns: GetText
    _: Function

    editor:GHTMLControl
    widget:GHTMLControl

    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        //this.store("base").nname = ""
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.linkEvents([
          [this.e.editButton, "click", this.toggle],
          [this.e.closeButton, "click", this.toggle],
        ])
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        //this.editor = new CVItemEdit(this.e.editorContainer.id)
    }




    private toggle(e:Event):void{
        let target = <HTMLElement>e.target
        if(target.id == this.e.editButton.id){
            this.e.controlContainer.style.display = "none"
            this.e.editContainer.style.display = "block"
        }
        else{
            this.e.controlContainer.style.display = "block"
            this.e.editContainer.style.display = "none"
        }
    }




    
}








export class ControlItemData extends GDataObject {
	
	


}
