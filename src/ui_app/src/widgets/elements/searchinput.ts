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








import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"
import {ButtonSelect} from "./buttonselect"







const view = `
any
    DIV class=columns is-mobile style=margin-bottom: 0;
        DIV class=column is-narrow
            LABEL gid=label
        DIV class=column
            INPUT gid=search name=term style=width:100% gdelay=800
    DIV gid=items 
`


export interface SearchInputParameters{
    rootId: string,
    label: string,
}




export class SearchInput extends GHTMLControl {



    bindingStore: Data
    private callBack:Function
    private _name:string
    private _select: ButtonSelect


    constructor(p:SearchInputParameters) { 
        super({view:view, root:p.rootId, bindToLocal:new Data()}) 
        this.e.label.textContent = p.label
        this._select = new ButtonSelect(this.e.items.id)
        this.linkEvents([[this._select, "selected", this.select]])
    }  




    delayedInput():void{
        this.dispatchEvent("input", this.bindingStore.term)
    }




    get value():string{    
        return(this._select.value)
    }




    set value(val:string){
        this._select.value = val
    }




    get options():Array<string>{
        return(this._select.options)
    }




    set options(options: Array<string>){
        this._select.options = options
    }




    private select(val:string){
        this.dispatchEvent("selected", val)
    }




    clear():void{
        this._select.clear()
        this.up()
    }

}







class Data extends GDataObject {
    
    control: SearchInput
    term: string = ""



    input(event:GHTMLInputEvent):void{
        this.control.delayedInput()
    }

}