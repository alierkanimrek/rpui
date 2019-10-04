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
        this.items.push(new NodeItem(this.NodeListContainer.id, "aha", "Some desc"))
        new NewNodeItem(this.NodeListContainer.id)
        //this.items.push(new NodeItem(this.NodeListContainer.id))
        //this.trns = this.store("trns").t.translations(name)
        //this._ = this.trns.get_()
        //this.trns.updateStatics()
        //this.linkEvents(this.emap)
    }



}








export class NodesData extends GDataObject {
	
	




    /*submit(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {"uname": this.uname, "passw":this.passw, "remember": this.remember}

        let conn = new Connection({
            port:Port.ulogin, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }*/

}
