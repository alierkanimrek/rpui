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
//import View from './main.ghtml'

import {Admin} from "./admin"

const name = "main"








let View = `
baseMainContent
    SECTION style=min-height: 100vh; 
        DIV gid=content class=tile is-ancestor
        DIV class=container has-text-centered
            p class=has-text-grey style=margin-top:2em;
                a gid=nodesLink
`









export class Main extends GHTMLControl {




	bindingStore:MainData
    _: Function
    admin: Admin




    constructor() {
        super({view:View, bindTo:name})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.linkEvents([[this.e.nodesLink, "click", this.footernav]])
        this.bindingStore.load(this.load.bind(this))
    }




    footernav(e:Event){
        this.gDoc.navigate("/"+this.store("session").user)
    }




    load(groups:Array<string>){
        if(groups.indexOf("ad") > -1 || groups.indexOf("rt") > -1){
           this.admin = new Admin(this.e.content.id)
        }
    }
}








export class MainData extends GDataObject {



    groups:Array<string>




    load( cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                this.groups = stack.dataVar("groups")
                cb(this.groups)
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)
        }

        let conn = new Connection({
            port:Port.getugrp, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {}})

    }

}
