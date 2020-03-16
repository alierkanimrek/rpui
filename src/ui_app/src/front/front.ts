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
import View from './front.ghtml'
import {Switch} from "../widgets/elements/switch"

const name = "front"










export class Front extends GHTMLControl {




	bindingStore:FrontData
    _: Function
    sw_server:Switch
    sw_signup:Switch




    constructor() {
        super({view:View, bindTo:name})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.sw_server = new Switch(this.e.serverstatus.id)
        this.sw_signup = new Switch(this.e.signupstatus.id)
        this.bindingStore.checkStatus(this.status.bind(this))
    }



    status(status:any){
        this.sw_server.checked = status["server"]
        this.sw_signup.checked = status["signup"]
        this.sw_server.freeze = true
        this.sw_signup.freeze = true
    }

}









export class FrontData extends GDataObject {




    checkStatus(getStatus:Function):void{
        
        let response:ResponseHandler = (stack:RpStack) => {
            getStatus(stack.dataVar("status"))    
        }

        let conn = new Connection({
            port:Port.getst, 
            name:name, 
            responseHandler:response})
        conn.run({ObjectData: {}})
    }
}
