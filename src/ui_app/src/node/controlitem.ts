import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"

import view from "./controlitem.ghtml"

import {CVItemEdit} from "./cvitemedit"
import {ControlWidgetData} from "../components/view"





const name = "controlitem"










export class ControlItem extends GHTMLControl {




	bindingStore:ControlItemData
    _: Function

    editor:CVItemEdit
    widget:GHTMLControl
    item:HTMLElement

    constructor(rootId:string, widgetData?:ControlWidgetData) {
        super({view:view, root:rootId, bindTo:name})
        //this.store("base").nname = ""
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.linkEvents([
          [this.e.editButton, "click", this.toggle],
          [this.e.closeButton, "click", this.toggle],
          [this.e.addButton, "click", this.addBefore],
        ])
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.editor = new CVItemEdit(this.e.editorContainer.id, widgetData)
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



    private addBefore(e:Event):void{
        this.dispatchEvent("add", this.e.item)
    }
    



    get data():ControlWidgetData{
        return(this.editor.data)
    }
}








export class ControlItemData extends GDataObject {
	
	


}
