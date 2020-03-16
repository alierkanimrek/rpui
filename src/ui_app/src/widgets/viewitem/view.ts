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
                P gid=name class=title is-size-4 is-capitalized style=margin: 0rem; cursor:default;
                | Name
                DIV class=columns is-mobile is-1
                    DIV class=column
                        P gid=desc style=margin: 0rem; cursor:default;
                        | Desc
                    DIV class=column is-narrow
                        i gid=editButton class=fas fa-edit role=button style=float:right; font-size:1.2em; cursor:pointer;
`











export class ViewItem extends GHTMLControl {




    item: HTMLElement
    name: HTMLParagraphElement
    desc: HTMLParagraphElement
    editButton: HTMLButtonElement
    eventMap: any = [
        [this.editButton, "click", this.edit],
        [this.name, "click", this.view],
        [this.desc, "click", this.view]
    ]

    private uri: string
    private _name:string



    constructor(rootId:string, name:string, desc:string) {
        super({view:view, root:rootId})
        this.name.textContent = name
        this._name = name
        this.desc.textContent = desc
        this.uri = "/"+this.gDoc.gData("session").user+"/view/"+name
        //this.trns = this.gDoc.gData("trns").t
        //this.trns.addEventListener("change", this.langChanged.bind(this))
        this.linkEvents(this.eventMap)
    }




    get vname():string{
        return(this._name)
    }




    public edit(e:Event):void{
        this.gDoc.navigate(this.uri+"/edit")
    }



    public view(e:Event):void{
        this.gDoc.navigate(this.uri)        
    }
}
