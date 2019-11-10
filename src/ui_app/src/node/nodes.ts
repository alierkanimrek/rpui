import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"

import {NodeItem} from "../widgets/nodeitem/node"
import {NewNodeItem} from "./newnode"



const name = "nodes"
const nodesView = `
baseMainContent
    DIV class=tile is-ancestor
        DIV class=tile is-parent gid=NodeListContainer
`









export class Nodes extends GHTMLControl {




	bindingStore:NodesData
    trns: GetText
    _: Function

    NodeListContainer:HTMLElement

    items: Array<NodeItem> = []

    /*emap: any = [
        [this.signupLink, "click", this.footer],
    ]*/




    constructor() {
        super({view:nodesView, bindTo:name})
        this.store("base").nname = ""
        
        //this.items.push(new NodeItem(this.NodeListContainer.id))
        //this.trns = this.store("trns").t.translations(name)
        //this._ = this.trns.get_()
        //this.trns.updateStatics()
        //this.linkEvents(this.emap)
        this.bindingStore.load(this.loaded.bind(this))
    }




    loaded(nodelist:Array<any>){
        //this.NodeListContainer.childNodes.forEach((c:HTMLElement)=>{
        //    this.NodeListContainer.removeChild(c)
        //})
        nodelist.forEach((node:any) =>{
            this.items.push(new NodeItem(this.NodeListContainer.id, node.nname, node.desc))
        })
        new NewNodeItem(this.NodeListContainer.id)
        this.bindingStore.checkAliveNodes(this.statusLoaded.bind(this))
    }




    statusLoaded(nodestatus:any){
        this.items.forEach((node:NodeItem)=>{
            node.status.status = nodestatus[node.nname]
        })
        
    }


}








export class NodesData extends GDataObject {
	
	

    nodenames: Array<string> = []




    load(cb:Function):void{



        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[AppNodes] Server error")
            }
            else{
                this.nodenames = []
                let nodelist:Array<any> = stack.dataVar("nodelist")
                nodelist.forEach((node:any) =>{
                    this.nodenames.push(node.nname)
                })

                cb(nodelist)
            }

        }

        let error:ErrorHandler = (msg:string) => {
            console.error("[AppNodes] "+msg)    
        }

        let data = {}

        let conn = new Connection({
            port:Port.getnodes, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

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

        let conn = new Connection({
            port:Port.chknodes, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }

}
