import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import "./base.css"
import baseView from './base.ghtml'














export class Base extends GHTMLControl {




    baseMenuItem: HTMLElement
    baseMenuContent: HTMLElement
    baseMenuButton: HTMLElement
    baseMainContent: HTMLElement


	bindingStore:BaseData
    



    constructor() {
        super({view:baseView, bindTo:"base"})

        this.baseMenuItem.addEventListener("click", this.toggleMenu.bind(this))
        this.baseMenuContent.style.display = "none"


    }




    toggleMenu(e:Event):void{

        if("fa fa-bars" == this.baseMenuButton.className){
            this.baseMenuButton.className = "fa fa-times"
            this.baseMainContent.style.display = "none"
            this.baseMenuContent.style.display = "block"
        }
        else{
            this.baseMenuButton.className = "fa fa-bars"
            this.baseMainContent.style.display = "block"
            this.baseMenuContent.style.display = "none"
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
