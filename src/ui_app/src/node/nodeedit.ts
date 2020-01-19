import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import view from "./nodeedit.ghtml"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
import {TaskEdit} from "../widgets/taskeditor/taskeditor"
import {SearchInput} from "../widgets/elements/searchinput"








const name = "nodeedit"








export class NodeEdit extends GHTMLControl {




	bindingStore:NodeEditData
    trns: GetText
    _: Function

    title:HTMLElement
    sendBtnContainer: HTMLElement
    sendButton:SendButton
    access:HTMLElement
    TaskListContainer:HTMLElement
    back:HTMLElement
    tasks:HTMLElement
    remove:HTMLElement
    removeMsgContainer:HTMLElement
    descInput:HTMLInputElement
    search1: SearchInput

    emap: Array<any> = [
        [this.back, "click", this.footernav],
        [this.tasks, "click", this.footernav],
        [this.remove, "click", this.footernav]
    ]



    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        
        this.search1 = new SearchInput({
            rootId: this.e.searchContainer1.id,
            label: "Search :",
            buttonLabel: "Add"
        })
        this.emap.push([this.search1, "selected", this.search1Selected])
        this.emap.push([this.search1, "input", this.search1Input])

        this.sendButton = new SendButton({
            rootId: this.sendBtnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("sendBtnLabel"),
            sendingMsg: this._("sending"),
            successMsg: this._("updateSuccess"),
            errorMsg: this._("updateError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })

        if(this.store("base").nname == ""){
            this.store("base").getNNameFromUri(this.gDoc.path)
        }
        this.bindingStore.load(this.store("base").nname, this.load.bind(this))

        this.linkEvents(this.emap)
    }





    footernav(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.back:
                this.gDoc.navigate("/"+this.store("session").user)
                break;
            case this.tasks:
                this.gDoc.navigate("/"+this.store("session").user+"/"+this.store("base").nname+"/edit/tasks")
                break;
            case this.remove:
                this.removeMsgContainer.style.visibility = "visible"
        }
    }




    update(e:Event){
        this.bindingStore.save(this.saved.bind(this))
    }




    load():void{
        this.up()
        this.title.textContent = this.bindingStore.title
    }



    saved(status:boolean, msg?:string){
        if(status){
            this.sendButton.success()
        }
        else{
            this.sendButton.error()
        }
    }



    input(event:GHTMLInputEvent):void{
        if(event.name == "desc" && event.value == "remove"){
            this.descInput.style.color = "red"
            this.sendButton.submit.style.backgroundColor = "red"
        }
        else{
            this.descInput.style.color = ""
            try{this.sendButton.submit.style.backgroundColor = ""}
            catch{    null    }
        }
    }




    search1Input(value:string){
        console.log(value)
        this.search1.upData(["ali", "veli", "deli"])
    }    




    search1Selected(value:string){
        console.log(value)
    }
}








export class NodeEditData extends GDataObject {
	
	
    title: string = ""
    desc: string = ""
    access: string = "0"




    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(!stack.dataVar("result")){
                this.title = stack.stack[0].data.nname
                this.desc = stack.stack[0].data.desc
                this.access = String(stack.stack[0].data.access)
                cb()
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let data = {"nname": nname}

        let conn = new Connection({
            port:Port.getnode, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }




    save(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {"title": this.title, "desc":this.desc, "access": Number(this.access)}

        let conn = new Connection({
            port:Port.upnode, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }

}
