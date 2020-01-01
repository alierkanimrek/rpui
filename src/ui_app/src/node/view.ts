import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SendButton} from "../widgets/elements/sendbutton"
import {SimpleMenu} from "../widgets/elements/simplemenu"
import {NewViewItem} from "./newview"
import {ControlItem} from "./controlitem"




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
    controlItem:GHTMLControl
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




    loadedV(viewData:Array<any>){
        //this.NodeListContainer.childNodes.forEach((c:HTMLElement)=>{
        //    this.NodeListContainer.removeChild(c)
        //})
        /*nodelist.forEach((node:any) =>{
            this.items.push(new NodeItem(this.NodeListContainer.id, node.nname, node.desc))
        })
        new NewNodeItem(this.NodeListContainer.id)
        if(this.items.length > 0){
            this.bindingStore.checkAliveNodes(this.statusLoaded.bind(this))
        }*/
        console.log(viewData)
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




    nav(name:string):void{
        this.gDoc.navigate("/"+this.gDoc.gData("session").user)
    }




    addControl():void{
        new NewViewItem(this.ViewListContainer.id)
    }




    addCVItem(e:Event|HTMLElement):void{
        let cvi = new ControlItem(this.ControlViewContainer.id)
        cvi.addEventListener("add", this.addCVItem.bind(this))
        if("tagName" in e){
            this.ControlViewContainer.insertBefore(cvi.item, e)
        }
    }




    save(e:Event):void{
        this.ControlViewContainer.childNodes.forEach((dom:ChildNode|any)=>{
            console.log(dom.control.editor.data)
        })
        this.saveButton.success()
    }
}








export class ViewData extends GDataObject {
	
	

    viewnames: Array<string> = []
    nodevars: Array<string> = []



    load(vname:string, cbV:Function, cbVL:Function):void{



        let responseV:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[View] Server error")
            }
            else{
                /*this.nodenames = []
                let nodelist:Array<any> = stack.dataVar("nodelist")
                nodelist.forEach((node:any) =>{
                    this.nodenames.push(node.nname)
                })*/
                cbV(stack)
            }
        }

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
            }
        }

        let responseNV:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[View] Server error")
            }
            else{
                this.nodevars = stack.dataVar("nodevars")
            }
        }


        let data = {"name":vname}

        let conn1 = new Connection({
            port:Port.getview, 
            name:name, 
            responseHandler:responseV})

        let conn2 = new Connection({
            port:Port.getviews, 
            name:name, 
            responseHandler:responseVL})

        let conn3 = new Connection({
            port:Port.getnodevars, 
            name:name, 
            responseHandler:responseNV})


        conn1.run({ObjectData: data})
        conn2.run({ObjectData: {}})
        conn3.run({ObjectData: {}})
    }


}
