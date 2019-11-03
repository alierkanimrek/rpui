import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {rules} from "../components/rules"
import {TaskEdit} from "../widgets/taskeditor/taskeditor"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
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
    selector:HTMLSelectElement
    newContainer: HTMLElement
    addBtn: HTMLButtonElement
    tnameInput: HTMLInputElement
    tnameInput_validityMessages: ValidityMessages
    tnameStatus: HTMLElement
    tnameMsg: HTMLElement
    wgtAddButton: HTMLElement
    AddNewBtn: SendButton
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
            let t = this.store("base").nname
            let title = t.charAt(0).toUpperCase() + t.substring(1)
            this.title.textContent = title
        }
        
        this.tnameInput.pattern = rules.tname
        this.tnameInput_validityMessages = this.store("trns").getValidityMessages(name, "tname")

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


        this.selector.size = 2
        this.load(this.store("base").nname, this.loaded.bind(this))
    }




    loaded(tasklist:any):void{
        console.log(tasklist)
    }




    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.stack)
        }

        let error:ErrorHandler = (msg:string) => {
            console.error(msg)    
        }

        let data = {"nname": nname}

        let conn = new Connection({
            port:Port.gettasks, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }




    footernav(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.back:
                this.gDoc.navigate("/"+this.store("session").user+"/"+this.store("base").nname+"/edit")
                break;
            case this.nodes:
                this.gDoc.navigate("/"+this.store("session").user+"/"+this.store("base").nname)
                break;
        }
    }




    openNew(e:Event){
        this.newContainer.style.visibility = "visible"
        this.newContainer.style.height = "" 
    }




    input(event:GHTMLInputEvent):void{
        switch (event.name) {
            
            case "tname":
                if( this.bindingStore.tnames.indexOf(this.bindingStore.tname) > -1){
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
            this.bindingStore.create(this.createResult.bind(this))
        }        
    }



    createResult(status:boolean):void{

        let restore = () => {
            this.newContainer.style.visibility = "hidden"
            this.newContainer.style.height = "0"
        }        

        if(status){
            this.AddNewBtn.success(restore.bind(this))
        }
        else{
            this.AddNewBtn.error()
        }
        
        
    }

}








export class TasksData extends GDataObject {
	

    tname: String = ""
    tnames: Array<String> = []



    create(responseHandler:Function):void{
        
        let error:ErrorHandler = (msg:string) => {
            responseHandler(false)    
        }        

        let response:ResponseHandler = (stack:RpStack) => {
            console.log(stack.dataVar("result"))
            responseHandler(true)    
        }


        let data = {"tname": this.tname}

        let conn = new Connection({
            port:Port.createtask, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }

}







