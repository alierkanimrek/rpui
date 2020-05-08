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








const view = `
any
  DIV class=field
    DIV class=columns is-mobile
      DIV class=column is-one-quarter style=margin:auto;
        LABEL gid=label class=is-left is-capitalized
      DIV class=column
        DIV class=columns is-mobile 
          DIV class=column style=margin:auto;
            SELECT gid=selector class=input is-capitalized name=value
          DIV class=column is-narrow style=margin:auto; padding-left:0;
            i gid=eraser class=fas fa-eraser has-text-grey-light style=pointer:cursor;
`


export interface SelectorParameters{
    rootId: string,
    name: string,
    inputCall: Function,
    options: Array<any>,
    label?: string,
    value?: string
}




export class Selector extends GHTMLControl {



    bindingStore: SelectorData
    private callBack:Function
    private _name:string
    selector:HTMLSelectElement
    eraser:HTMLElement




    constructor(p:SelectorParameters) {
        super({view:view, root:p.rootId, bindToLocal:new SelectorData()})
        this.e.label.textContent = p.label
        this._name = p.name
        this.callBack = p.inputCall
        this.bindingStore.value_options = p.options
        if(p.value){    this.bindingStore.value = p.value    }
        this.up()
        this.eraser.addEventListener("click", this.erase.bind(this))
    }




    input(event:GHTMLInputEvent):void{
        this.callBack(event)
    }



    erase(e:Event){
        this.bindingStore.value = ""
        this.up()
    }



    get name():string{    
        return(this._name)
    }



    get value():string{    
        return(this.bindingStore.value)
    }

}







class SelectorData extends GDataObject {
    
    value: string = ""
    value_options: Array<string> = []
}