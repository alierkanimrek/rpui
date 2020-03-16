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








import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"













const view = `
any
    DIV class=tile is-child box style=margin: 1rem !important; gid=item
        DIV class=columns is-mobile is-1 
            DIV class=column
                P gid=title class=title is-size-5 is-capitalized style=margin: 0rem; cursor:default;
                DIV class=columns is-mobile is-1 style=margin-top:0;
                    DIV class=column
                        P gid=items style=margin: 0rem; cursor:default;
                    DIV class=column is-narrow
                        i gid=addButton class=fas fa-plus role=button style=float:right; font-size:1.2em; cursor:pointer;
`                        











export class SimpleMenu extends GHTMLControl {




    items: HTMLParagraphElement
    title: HTMLParagraphElement
    addButton: HTMLButtonElement
    eventMap: any = [
        [this.addButton, "click", this.add]
    ]

    private uri: string
    private menuItems: Array<string>
    private select: Function
    private addItem: Function 


    constructor(rootId:string, title:string, items:Array<string>, select:Function, add:Function) {
        super({view:view, root:rootId})
        this.title.textContent = title
        this.menuItems = items
        this.select = select
        this.addItem = add
        this.uri = "/"+this.gDoc.gData("session").user+"/view/"
        //this.trns = this.gDoc.gData("trns").t
        //this.trns.addEventListener("change", this.langChanged.bind(this))
        this.linkEvents(this.eventMap)
        this.createMenu()
    }




    createMenu(items?:Array<string>):void{
        while(this.items.children[0]){
            this.items.children[0].remove()
        }
        if(items){    this.menuItems = items    }
        this.menuItems.forEach((i:string)=>{
            new SimpleMenuItem(this.items.id, i, this.select)
        })
    }




    add(e:Event):void{
        this.addItem()
    }
}









const itemview = `
any
    BUTTON gid=button class=button is-capitalized style=margin-right:0.5rem;
`  




class SimpleMenuItem extends GHTMLControl {




    button: HTMLButtonElement
    select: Function
    eventMap: any = [
        [this.button, "click", this.hit]
    ]




    constructor(rootId:string, name:string, select:Function) {
        super({view:itemview, root:rootId})
        this.button.textContent = name
        this.select = select
        this.linkEvents(this.eventMap)
    }




    hit(e:Event):void{
        this.select(this.button.textContent)
    }

}
