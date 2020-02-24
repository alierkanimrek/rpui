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
        this.bindingStore.load(this.load.bind(this))
    }




    load(groups:Array<string>){
        if(groups.indexOf("ad") > -1){
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
