import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
//import View from './admin.ghtml'

import {UGroup} from "./ugroup"
import {Invite} from "./invite"

const name = "admin"








let View = `
any
    DIV gid=container class=tile is-parent is-vertical
        DIV class=tile is-child
            P gid=title class=title is-size-5
`








export class Admin extends GHTMLControl {




	bindingStore:AdminData
    _: Function

    ugroup: UGroup
    invite: Invite



    constructor(rootId:string) {
        super({view:View, bindTo:name, root:rootId})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.ugroup = new UGroup(this.e.container.id)
        this.invite = new Invite(this.e.container.id)
    }




}








export class AdminData extends GDataObject {




}
