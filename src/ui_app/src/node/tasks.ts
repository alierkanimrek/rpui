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
import {RpStack} from "../components/msg"
import {rules} from "../components/rules"
import {TaskEdit} from "../widgets/taskeditor/taskeditor"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
import {ButtonSelect} from "../widgets/elements/buttonselect"
import view from "./tasks.ghtml"

const name = "tasks"
const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"









export class Tasks extends GHTMLControl {




	bindingStore:TasksData
    trns: GetText
    _: Function

    title:HTMLLabelElement
    back:HTMLElement
    nodes:HTMLElement
    selector:ButtonSelect
    newContainer: HTMLElement
    addBtn: HTMLButtonElement
    tnameInput: HTMLInputElement
    tnameInput_validityMessages: ValidityMessages
    tnameStatus: HTMLElement
    tnameMsg: HTMLElement
    wgtAddButton: HTMLElement
    wgtRemoveButton: HTMLElement
    AddNewBtn: SendButton
    removeBtn: SendButton
    AddNewStatus: HTMLElement

    items: Array<TaskEdit> = []

    emap: any = [
        [this.back, "click", this.footernav],
        [this.nodes, "click", this.footernav],
        [this.addBtn, "click", this.openNew]
    ]



    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        this.linkEvents(this.emap)

        if(this.store("base").nname == ""){
            this.store("base").getNNameFromUri(this.gDoc.path)
        }
        let t = this.store("base").nname
        let title = t.charAt(0).toUpperCase() + t.substring(1)
        this.title.textContent = title
        
        this.tnameInput.pattern = rules.tname
        this.tnameInput_validityMessages = this.store("trns").getValidityMessages(name, "tname")

        this.selector = new ButtonSelect(this.e.selectContainer.id)

        this.AddNewBtn = new SendButton({
            rootId: this.wgtAddButton.id,
            clickCall: this.create.bind(this),
            buttonLabel: this._("AddNewBtn"),
            sendingMsg: this._("creating"),
            successMsg: this._("createSuccess"),
            errorMsg: this._("createError"),
            disabled: true,
            classx: "button is-block is-info is-fullwidth is-medium"
        })

        this.removeBtn = new SendButton({
            rootId: this.wgtRemoveButton.id,
            clickCall: this.remove.bind(this),
            buttonLabel: this._("removeBtn"),
            sendingMsg: this._("removing"),
            successMsg: this._("removeSuccess"),
            errorMsg: this._("removeError"),
            disabled: false,
            classx: "button is-block is-danger is-fullwidth is-medium"
        })

        this.bindingStore.load(this.store("base").nname, this.loaded.bind(this))
    }




    loaded(tasklist:any){
        this.selector.options = this.bindingStore.tnames_options
        this.up()
    }




    footernav(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.back:
                this.gDoc.navigate("/"+this.store("session").user+"/"+this.store("base").nname+"/edit")
                break;
            case this.nodes:
                this.gDoc.navigate("/"+this.store("session").user)
                break;
        }
    }




    openNew(e:Event){
        this.newContainer.style.visibility = "visible"
        this.AddNewBtn.submit.style.visibility = "visible"
        this.newContainer.style.height = "" 
    }




    input(event:GHTMLInputEvent):void{
        switch (event.name) {
            
            case "tname":
                if( this.bindingStore.tnames_options.indexOf(this.bindingStore.tname) > -1){
                    this.tnameInput.setCustomValidity(this._("tnameExist"))
                }
                if (this.tnameInput.validity.valid){
                    this.tnameStatus.className = classOk
                    this.tnameMsg.innerText = ""
                    this.AddNewBtn.disabled = false
                }
                else{
                    this.tnameStatus.className = classBan
                    this.tnameMsg.innerText = this.tnameInput.validationMessage
                    this.AddNewBtn.disabled = true
                }
        }
    }




    create(e:Event){
        if(this.tnameInput.validity.valid){
            this.bindingStore.create(this.store("base").nname, this.createResult.bind(this))
        }        
    }




    createResult(status:boolean):void{

        let restore = () => {
            this.newContainer.style.visibility = "hidden"
            this.AddNewBtn.submit.style.visibility = "hidden"
            this.newContainer.style.height = "0"
            this.bindingStore.load(this.store("base").nname, this.loaded.bind(this))
        }        

        if(status){
            this.AddNewBtn.success(restore.bind(this))
        }
        else{
            this.AddNewBtn.error()
        }
        
        
    }




    remove(e:Event){
        if(this.selector.value){
            this.bindingStore.remove(this.store("base").nname, this.selector.value, this.removeResult.bind(this))
        }
        else{
            this.removeBtn.error()
        }        
    }




    removeResult(status:boolean):void{

        let restore = () => {
            this.bindingStore.load(this.store("base").nname, this.loaded.bind(this))
        }        

        if(status){
            this.removeBtn.success(restore.bind(this))
        }
        else{
            this.removeBtn.error()
        }
    }

}








export class TasksData extends GDataObject {
	

    tname: string = ""
    tnames: string = ""
    tnames_options: Array<string> = []




    load(nname:string, cb:Function):void{

        this.tnames_options = []
        this.up()

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                this.tname = ""    
                let tasks:Array<any> = stack.stack[0].data.result
                tasks.forEach( (t:any)=>{
                    this.tnames_options.push(t.tname)
                })
                cb(tasks)
            }
            else{    null    }

        }

        let error:ErrorHandler = (msg:string) => {
            console.error("[AppTasks] "+msg)    
        }

        let data = {"nname": nname}

        let conn = new Connection({
            port:Port.gettasks, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }




    create(nname:string, cb:Function):void{
        
        let error:ErrorHandler = (msg:string) => {
            cb(false)
        }        

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){    cb(true)    }
            else{    cb(false)    }
        }


        let data = {"nname": nname, "tname": this.tname}

        let conn = new Connection({
            port:Port.createtask, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }




    remove(nname:string, tname:string, cb:Function):void{
        
        let error:ErrorHandler = (msg:string) => {
            cb(false)
        }        

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){    cb(true)    }
            else{    cb(false)    }
        }


        let data = {"nname": nname, "tname": tname}

        let conn = new Connection({
            port:Port.deltask, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }

}