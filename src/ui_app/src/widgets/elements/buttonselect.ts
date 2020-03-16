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
    DIV gid=items 
`






export class ButtonSelect extends GHTMLControl {



    private callBack:Function
    private _options: Array<string> = []
    private _value: string = ""
    private _last: HTMLButtonElement



    constructor(rootId:string) { 
        super({view:view, root:rootId}) 
    }  




    get value():string{    
        return(this._value)
    }




    set value(val:string){
        this.e.items.childNodes.forEach((btn:HTMLButtonElement)=>{
            console.log(btn.value, val)
            if(btn.value == val){
                this.focus(btn)
            }
        })
    }




    get options():Array<string>{
        return(this._options)
    }




    set options(options: Array<string>){
        this._options = options
        this.clear()
        options.forEach((opt:string)=>{
            let btn = this.e.items.add("button", {
                "class": "button is-rounded is-capitalized",
                "type" : "button",
                "value" : opt,
                "style" : "margin: 0.2rem;"
            })
            btn.textContent = opt
            btn.addEventListener("click", this.select.bind(this))
        })

    }



    select(e:Event){
        this.focus(<HTMLButtonElement>e.target)
        this.dispatchEvent("selected", this._last.value)
    }




    focus(btn:HTMLButtonElement|GHTMLControl){
        if(this._last){
            this._last.className = "button is-rounded is-capitalized"
        }
        this._last = <HTMLButtonElement>btn
        this._last.className = "button is-rounded is-capitalized is-light" 
        this._value = this._last.value
    }




    clear():void{
        while (this.e.items.childNodes.length > 0) { this.e.items.childNodes[0].remove() }
    }



    
    removeSelected(){
        let newlist:Array<string> = []
        this._options.forEach((val:string)=>{
            if(this._value != val){
                newlist.push(val)
            }
        })
        this.options = newlist
    }




    add(val:string){
        let swp = this._options
        swp.push(val)
        this.options = swp
    }




}
