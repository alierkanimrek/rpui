import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack, UserData} from "../components/msg"

import view from "./controlitem.ghtml"

import {CVItemEdit} from "./cvitemedit"
import {ControlWidgetData} from "../components/view"
import {CWBase} from "../widgets/control/interfaces"
import {createCW} from "../widgets/control/cwdata"





const name = "controlitem"










export class ControlItem extends GHTMLControl {




	bindingStore:ControlItemData
    _: Function

    editor:CVItemEdit
    widget:CWBase
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
          [this.e.okButton, "click", this.save],
          [this.e.removeButton, "click", this.remove],
          [this.e.upButton, "click", this.goUpDown],
          [this.e.downButton, "click", this.goUpDown]
        ])
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.editor = new CVItemEdit(this.e.editorContainer.id, widgetData)
        this.widget = createCW({rootId: this.e.controlContainer.id, wdata:widgetData})
        this.e.title.textContent = widgetData.title
        this.widget.addEventListener("cmd", this.cmd.bind(this))
    }




    private toggle(e?:Event):void{
        if(this.e.controlContainer.style.display == ""){
            this.e.controlContainer.style.display = "none"
            this.e.editContainer.style.display = ""
        }
        else{
            this.e.controlContainer.style.display = ""
            this.e.editContainer.style.display = "none"
        }
    }



    private addBefore(e:Event):void{
        this.dispatchEvent("add", this.e.item)
    }
    



    private goUpDown(e:Event){
        if(e.target == this.e.upButton){    this.dispatchEvent("move", [this.e.item, "up"])    }
        else{    this.dispatchEvent("move", [this.e.item, "down"])    }
    }




    get data():ControlWidgetData{
        return(this.editor.data)
    }



    save(e:Event){
        this.editor.save()
        this.widget.clear()
        this.widget = createCW({rootId: this.e.controlContainer.id, wdata:this.editor.data})
        this.e.title.textContent = this.editor.data.title
        this.toggle()
    }




    private remove(e:Event){
        this.dispatchEvent("remove", this.id)
    }




    set taskData(data:UserData){
        this.widget.data = data
    }




    cmd(widget:CWBase){
        if(widget.autoSend){
            this.dispatchEvent("cmd", widget)
        }
        else{
            console.log("Auto send: off")
        }
    }

}








export class ControlItemData extends GDataObject {





}
