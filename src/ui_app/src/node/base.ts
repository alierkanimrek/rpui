import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import "../user/base.css"
import baseView from '../user/base.ghtml'
import {GetText} from "../i18n/gettext"
import {parseUri} from "../components/source"

// Menu items
import {LangMenuItem} from "../widgets/menu/lang"
import {ViewportMenuItem} from "../widgets/menu/viewport"









const name = "base"











export class Base extends GHTMLControl {




    baseMenuItem: HTMLElement
    baseMenuContent: HTMLElement
    baseMenuButton: HTMLElement
    baseMainContent: HTMLElement

    emap: any = [
        [this.baseMenuItem, "click", this.toggleMenu]
    ]


	bindingStore:BaseData
    trns:GetText

    



    constructor() {
        super({view:baseView, bindTo: name})

        this.baseMenuContent.style.display = "none"

        this.trns = this.gDoc.gData("trns").t.translations(name)
        //new LangSelector(this.baseMenuContent.id)
        //new Switch(this.baseMenuContent.id)
        new LangMenuItem()
        new ViewportMenuItem()

        this.trns.updateStatics()
        this.linkEvents(this.emap)

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
	

    nname:string = ""


    public getNNameFromUri(uri:string):string{
        let source = parseUri(uri)
        this.nname = source.nname
        return(this.nname)
    }

}
