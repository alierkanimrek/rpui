import {GHTMLControl, GDataObject} from "../../glider/glider"

import {LangSelector} from "../../widgets/lang/selector"
//import {Switch} from "../widgets/elements/switch"












const view = `
mainMenuContainer
    DIV class = tile is-parent
        DIV class = tile is-child box
            P class=title is-5 id=mainMenuLgTitle
            DIV gid=inputbox

`










export class LangMenuItem extends GHTMLControl {





    inputbox:HTMLElement




    constructor() {
        super({view:view})
        new LangSelector(this.inputbox.id)
    }




}
