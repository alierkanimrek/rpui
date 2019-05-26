import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import "./base.css"
import baseView from './base.ghtml'
import {GetText} from "../i18n/gettext"

import {LangSelector} from "../widgets/lang/selector"


const name = "base"











export class Base extends GHTMLControl {




    baseMenuItem: HTMLElement
    baseMenuContent: HTMLElement
    baseMenuButton: HTMLElement
    baseMainContent: HTMLElement


	bindingStore:BaseData
    trns:GetText
    



    constructor() {
        super({view:baseView, bindTo: name})

        this.baseMenuItem.addEventListener("click", this.toggleMenu.bind(this))
        this.baseMenuContent.style.display = "none"
        this.trns = this.gDoc.gData("trns").t.translations(name)

        new LangSelector(this.baseMenuContent.id)


        this.trns.updateStatics()
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
