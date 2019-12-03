import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"

import {NodeStatus} from "../elements/nodestatus"












const view = `
any
    DIV class=tile is-child box style=margin: 1rem !important; gid=item
        DIV class=columns is-mobile is-1 
            DIV class=column is-narrow gid=statusContainer
            DIV class=column
                P gid=name class=title is-size-4 is-capitalized style=margin: 0rem; cursor:default;
                | Name
                DIV class=columns is-mobile is-1
                    DIV class=column
                        P gid=desc style=margin: 0rem; cursor:default;
                        | Desc
                    DIV class=column is-narrow
                        i gid=editButton class=fas fa-edit role=button style=float:right; font-size:1.2em; cursor:pointer;
`











export class NodeItem extends GHTMLControl {




    item: HTMLElement
    statusContainer: HTMLElement
    public status: NodeStatus
    name: HTMLParagraphElement
    desc: HTMLParagraphElement
    editButton: HTMLButtonElement
    eventMap: any = [
        [this.editButton, "click", this.edit],
        [this.statusContainer, "click", this.node],
        [this.name, "click", this.node],
        [this.desc, "click", this.node]
    ]

    private uri: string
    private _name:string



    constructor(rootId:string, name:string, desc:string) {
        super({view:view, root:rootId})
        this.name.textContent = name
        this._name = name
        this.desc.textContent = desc
        this.uri = "/"+this.gDoc.gData("session").user+"/"+name
        //this.trns = this.gDoc.gData("trns").t
        //this.trns.addEventListener("change", this.langChanged.bind(this))
        this.linkEvents(this.eventMap)        
        this.status = new NodeStatus(this.statusContainer.id)
    }




    get nname():string{
        return(this._name)
    }




    public edit(e:Event):void{
        this.store("base").nname = this.name.textContent
        this.gDoc.navigate(this.uri+"/edit")
    }



    public node(e:Event):void{
        this.store("base").nname = this.name.textContent
        this.gDoc.navigate(this.uri)        
    }
}
