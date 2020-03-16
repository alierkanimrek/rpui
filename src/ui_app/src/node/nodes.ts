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

import {NodeItem} from "../widgets/nodeitem/node"
import {NewNodeItem} from "./newnode"
import {SimpleMenu} from "../widgets/elements/simplemenu"
import {NewViewItem} from "./newview"




const name = "nodes"
const nodesView = `
baseMainContent
    DIV class=tile is-ancestor
        DIV class=tile is-vertical is-parent
            DIV class=tile is-child gid=ViewListContainer
            DIV class=tile is-child
                DIV class=columns is-multiline gid=NodeListContainer
            DIV class=tile is-child gid=FooterMenuContainer
`

                    








export class Nodes extends GHTMLControl {




	bindingStore:NodesData
    trns: GetText
    _: Function

    NodeListContainer:HTMLElement
    ViewListContainer:HTMLElement

    items: Array<NodeItem> = []




    constructor() {
        super({view:nodesView, bindTo:name})
        this.store("base").nname = ""
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()        
        this.bindingStore.load(this.loadedN.bind(this), this.loadedV.bind(this))
    }




    loadedN(nodelist:Array<any>){
        //this.NodeListContainer.childNodes.forEach((c:HTMLElement)=>{
        //    this.NodeListContainer.removeChild(c)
        //})
        nodelist.forEach((node:any) =>{
            this.items.push(new NodeItem(this.NodeListContainer.id, node.nname, node.desc))
        })
        new NewNodeItem(this.NodeListContainer.id)
        if(this.items.length > 0){
            this.bindingStore.checkAliveNodes(this.statusLoaded.bind(this))
        }
    }




    loadedV(viewlist:Array<any>){
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




    statusLoaded(nodestatus:any){
        this.items.forEach((node:NodeItem)=>{
            node.status.status = nodestatus[node.nname]
        })
    }



    onRemove(){
        this.bindingStore.chkAliveConn.pause()
    }


}








export class NodesData extends GDataObject {
	
	

    nodenames: Array<string> = []
    viewnames: Array<string> = []
    chkAliveConn: Connection



    load(cbN:Function, cbV:Function):void{



        let responseN:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[Dashboard] Server error")
            }
            else{
                this.nodenames = []
                let nodelist:Array<any> = stack.dataVar("nodelist")
                nodelist.forEach((node:any) =>{
                    this.nodenames.push(node.nname)
                })
                cbN(nodelist)
            }
        }

        let responseV:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[Dashboard] Server error")
            }
            else{
                this.viewnames = []
                let viewlist:Array<any> = stack.dataVar("viewlist")
                viewlist.forEach((view:any) =>{
                    this.viewnames.push(view.vname)
                })
                cbV(viewlist)
            }
        }


        let error:ErrorHandler = (msg:string) => {
            console.error("[Dashboard] "+msg)    
        }

        let data = {}

        let conn1 = new Connection({
            port:Port.getnodes, 
            name:name, 
            responseHandler:responseN,
            errorHandler:error})

        let conn2 = new Connection({
            port:Port.getviews, 
            name:name, 
            responseHandler:responseV,
            errorHandler:error})

        conn1.run({ObjectData: data})
        conn2.run({ObjectData: data})

    }




    checkAliveNodes(cb:Function):void{


        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[AppNodes] Server error")
            }
            else{
                cb(stack.data("root/server/xhrchknodes"))
            }

        }

        let error:ErrorHandler = (msg:string) => {
            console.error("[AppNodes] "+msg)    
        }

        let data = {"nodenames": this.nodenames}

        this.chkAliveConn = new Connection({
            port:Port.chknodes, 
            name:name, 
            responseHandler:response,
            errorHandler:error,
            repeat: true,
            upData: this.preSend.bind(this)})

        this.chkAliveConn.run({ObjectData: data})
    }




    preSend():void{
        this.chkAliveConn.objectData = {"nodenames": this.nodenames}
    }

}
