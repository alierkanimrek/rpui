import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"

import {SimpleMenu} from "../widgets/elements/simplemenu"
import {NewViewItem} from "./newview"
import {ControlItem} from "./controlitem"




const name = "view"
const view = `
baseMainContent
    DIV class=tile is-ancestor
        DIV class=tile is-parent gid=ViewListContainer
        DIV class=tile is-parent gid=ControlViewContainer
`









export class View extends GHTMLControl {




	bindingStore:ViewData
    trns: GetText
    _: Function

    ViewListContainer:HTMLElement
    ControlViewContainer:HTMLElement
    controlItem:GHTMLControl




    constructor() {
        super({view:view, bindTo:name})
        //this.store("base").nname = ""
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()        
        this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.controlItem = new ControlItem(this.ControlViewContainer.id)
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
        this.gDoc.navigate("/"+this.gDoc.gData("session").user+"/view/"+name)
    }




    addControl():void{
        new NewViewItem(this.ViewListContainer.id)
    }

}








export class ViewData extends GDataObject {
	
	

    viewnames: Array<string> = []



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


        let data = {"name":vname}

        let conn1 = new Connection({
            port:Port.getview, 
            name:name, 
            responseHandler:responseV})

        let conn2 = new Connection({
            port:Port.getviews, 
            name:name, 
            responseHandler:responseVL})

        conn1.run({ObjectData: data})
        conn2.run({ObjectData: {}})

    }


}
