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








import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../glider/glider"
import "../user/base.css"
import baseView from '../user/base.ghtml'
import {GetText} from "../i18n/gettext"
import {parseUri} from "../components/source"

// Menu items
import {LangMenuItem} from "../widgets/menu/lang"
import {ViewportMenuItem} from "../widgets/menu/viewport"
import {UserItem} from "../widgets/menu/user"









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
        
        this.parseUri()

        this.baseMenuContent.style.display = "none"

        this.trns = this.gDoc.gData("trns").t.translations(name)
        //new LangSelector(this.baseMenuContent.id)
        //new Switch(this.baseMenuContent.id)
        new UserItem()
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

    parseUri():void{
        let source = parseUri(this.gDoc.path)
        this.bindingStore.nname = source.nname
        this.bindingStore.name = source.name
    }
}








export class BaseData extends GDataObject {
	

    nname:string = ""
    name:string = ""


    public getNNameFromUri(uri:string):string{
        let source = parseUri(uri)
        this.nname = source.nname
        return(this.nname)
    }

}
