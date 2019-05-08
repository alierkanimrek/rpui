import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../glider/glider"
import "./base.css"
import baseView from './base.ghtml'














export class Base extends GHTMLControl {




	bindingStore:BaseData
    



    constructor() {
        super({view:baseView, bindTo:"base"})
        this.e["baseMenuItem"].addEventListener("click", this.menu.bind(this))
        this.e["baseMenuContent"].style.display = "none"
    }


    menu(e:Event|any):void{
        let button = this.e["baseMenuButton"]
        let main = this.e["baseMainContent"]
        let menu = this.e["baseMenuContent"]
        if("fa fa-bars" == button["className"]){
            button["className"] = "fa fa-times"
            main.style.display = "none"
            menu.style.display = "block"
        }
        else{
            button["className"] = "fa fa-bars"
            main.style.display = "block"
            menu.style.display = "none"

        }
    }

    /*
    submit(e:Event){
        console.log(this.bindingStore)
        //window.location.hash = "/test"
    }
    */



}




export class BaseData extends GDataObject {
	


}
