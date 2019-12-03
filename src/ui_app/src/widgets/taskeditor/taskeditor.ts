import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"













const view = `
any
    DIV class=tile is-child box style=margin: 1rem !important; gid=item
`











export class TaskEdit extends GHTMLControl {




    eventMap: any = [
    ]

    constructor(rootId:string) {
        super({view:view, root:rootId})
        //this.linkEvents(this.eventMap)        
    }




}
