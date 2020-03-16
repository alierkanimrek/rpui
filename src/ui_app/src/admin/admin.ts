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
