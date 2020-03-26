/*
    The MIT License:

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
*/








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
          [this.e.downButton, "click", this.goUpDown],
          [this.e.cancelButton, "click", this.cancelCmd],
          [this.e.sendButton, "click", this.sendCmd]
        ])
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.editor = new CVItemEdit(this.e.editorContainer.id, widgetData)
        this.widget = createCW({rootId: this.e.widgetContainer.id, wdata:widgetData})
        if(widgetData){
            this.e.title.textContent = widgetData.title
        }
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
        this.widget = createCW({rootId: this.e.widgetContainer.id, wdata:this.editor.data})
        this.e.title.textContent = this.editor.data.title
        this.widget.addEventListener("cmd", this.cmd.bind(this))
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
            // Send Variables by View.cmdCVItem
            this.dispatchEvent("cmd", widget)
        }
        else{
            // Show send/cancel bar for sending
            this.widget.updating = false
            this.e.sendBar.style.display = ""
            this.e.sendBar.style.height = ""
        }
    }




    cancelCmd(e:GHTMLInputEvent){
        this.widget.updating = true
        this.widget.clearCmd()
        this.e.sendBar.style.display = "none"
        this.e.sendBar.style.height = "0"        
    }



    sendCmd(e:GHTMLInputEvent){
        this.widget.updating = true
        this.e.sendBar.style.display = "none"
        this.e.sendBar.style.height = "0"
        // Send Variables by View.cmdCVItem
        this.dispatchEvent("cmd", this.widget)
    }

}








export class ControlItemData extends GDataObject {





}
