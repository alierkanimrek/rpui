import {GHTMLControl, GDataObject, GHTMLElement, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SendButton} from "../widgets/elements/sendbutton"
import {SimpleMenu} from "../widgets/elements/simplemenu"
import {NewViewItem} from "./newview"
import {ControlItem} from "./controlitem"
import {ControlWidgetData, ControlView} from "../components/view"




const name = "view"
const view = `
baseMainContent
    DIV class=tile is-ancestor
        DIV class=tile is-parent gid=ViewListContainer
        DIV class=tile is-parent gid=ControlViewContainer
        DIV class=tile is-parent gid=FooterContainer
            DIV class=tile is-child style=padding: 0.75rem !important; text-align: center;
                i gid=addButton class=fas fa-plus role=button style=float:center; font-size:1.2em; cursor:pointer;
            DIV gid=saveContainer
            P class=has-text-grey
                A gid=nodesLink
`









export class View extends GHTMLControl {




	bindingStore:ViewData
    _: Function

    ViewListContainer:HTMLElement
    ControlViewContainer:HTMLElement
    saveContainer:HTMLElement
    saveButton:SendButton





    constructor() { 
        super({view:view, bindTo:name}) 
        //this.store("base").nname = ""
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.linkEvents([
          [this.e.addButton, "click", this.addCVItem],
          [this.e.nodesLink, "click", this.nav]
        ])
        this.saveButton = new SendButton({
            rootId: this.saveContainer.id,
            clickCall: this.save.bind(this),
            buttonLabel: this._("saveBtnLabel"),
            sendingMsg: this._("saving"),
            successMsg: this._("saveSuccess"),
            errorMsg: this._("saveError"),
            classx: "button is-block is-info is-medium"
        })        
    }




    loadedV(view:ControlView){
        
        for (let i = 0; i < view.items.length; i++) {
            view.items.forEach((item:ControlWidgetData)=>{
                if(item.order == i){    
                    let ci = new ControlItem(this.ControlViewContainer.id, item)
                    ci.addEventListener("remove", this.remove.bind(this))
                    ci.addEventListener("add", this.addCVItem.bind(this))
                    ci.addEventListener("move", this.moveCVItem.bind(this))
                }
            })
        }
    }




    loadedVL(viewlist:Array<any>){
        let names: Array<string> = []
        viewlist.forEach((view:any) =>{
            names.push(view.vname)
        })
        new SimpleMenu(
            this.ViewListContainer.id, 
            this._("cMenu"), 
            names, 
            this.nav.bind(this), 
            this.addControl.bind(this))
    }




    remove(id:any){
        this.ControlViewContainer.childNodes.forEach((cn:any)=>{
            if(cn.control.id == id){
                cn.control.clear()
            }
        })
    }




    nav(name:string):void{
        this.gDoc.navigate("/"+this.gDoc.gData("session").user+"/view/"+name)
    }




    addControl():void{
        new NewViewItem(this.ViewListContainer.id)
    }




    moveCVItem(moveIt:Array<any>){
        let index:number = 0
        let cns:any = this.ControlViewContainer.childNodes
        for (let i = 0; i < cns.length; i++) {
            if(moveIt[0].id == cns[i].id){    index = i    }
        }
        if(moveIt[1] == "up" && index > 0){
            this.ControlViewContainer.insertBefore(moveIt[0], cns[index-1])
        }
        else if(moveIt[1] == "down" && index < cns.length-1){
            this.ControlViewContainer.insertBefore(cns[index+1], moveIt[0])
        }
    }




    addCVItem(e:Event|HTMLElement):void{
        let controlItem = new ControlItem(this.ControlViewContainer.id)
        controlItem.addEventListener("add", this.addCVItem.bind(this))
        controlItem.addEventListener("remove", this.remove.bind(this))
        controlItem.addEventListener("move", this.moveCVItem.bind(this))
        if("tagName" in e){
            this.ControlViewContainer.insertBefore(controlItem.item, e)
        }
    }




    save(e:Event):void{

        let items:Array<any> = <any>this.ControlViewContainer.childNodes
        let wdata:ControlWidgetData
        let data:Array<ControlWidgetData> = []

        for (let i = 0; i < items.length; i++) {
            wdata =  items[i].control.data
            wdata.order = i
            data.push(wdata)
        }
        this.bindingStore.save(this.store("base").name, data, this.saved.bind(this))
    }



    saved(result:boolean):void{
        if(result){    this.saveButton.success()    }
        else{    this.saveButton.error()    }
    }
}








export class ViewData extends GDataObject {
	
	

    viewnames: Array<string> = []
    nodevars: Array<string> = []    //cvitemedit use it
    view: ControlView



    load(vname:string, cbV:Function, cbVL:Function):void{

        // Load ViewList
        let responseVL:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[View] Server error")
            }
            else{
                this.viewnames = []
                let viewlist:Array<any> = stack.dataVar("viewlist")
                viewlist.forEach((view:any) =>{
                    this.viewnames.push(view.vname)
                })
                cbVL(viewlist)


                // Load Nodevars
                let responseNV:ResponseHandler = (stack:RpStack) => {
                    if(stack.dataVar("result")){
                        console.error("[View] Server error")
                    }
                    else{
                        this.nodevars = stack.dataVar("nodevars")


                        // Load View
                        let responseV:ResponseHandler = (stack:RpStack) => {
                            if(stack.dataVar("result")){
                                this.view = stack.dataVar("view")
                                cbV(this.view)
                            }
                            else{
                                console.error("[View] Server error")
                            }
                        }
                        new Connection({
                            port:Port.getview, 
                            name:name, 
                            responseHandler:responseV}).run({ObjectData: {"vname":vname}})
                    }
                }
                new Connection({
                    port:Port.getnodevars, 
                    name:name, 
                    responseHandler:responseNV}).run({ObjectData: {}})
                    }
        }
        new Connection({
            port:Port.getviews, 
            name:name, 
            responseHandler:responseVL}).run({ObjectData: {}})
    }




    save(name:string, data:Array<ControlWidgetData>, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){    cb(stack.dataVar("result"))    }
            else{    
                console.error("[View] Server error")
                cb(false)
            }
        }

        let parms = { vname:name, items:data}

        let conn = new Connection({
            port:Port.saveview, 
            name:name,
            responseHandler:response})
        
        conn.run({ObjectData: parms})
    }

}
