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








import {GHTMLControl} from "../../glider/glider"








const view = `
any
    TABLE class=table is-narrow
        TBODY
            TR
                TD style=padding-right: 0;
                    A class=button is-small is-text gid=left
                TD style=padding-left: 0;
                    A class=button is-small is-light gid=right

`


const LeftON = "button is-success is-small"
const LeftOFF = "button is-text is-small"
const RightON = "button is-text is-small"
const RightOFF = "button is-light is-small"





export class Switch extends GHTMLControl {





    left:HTMLButtonElement
    right:HTMLButtonElement
    _checked:boolean = false
    freeze:boolean = false
    changeEvent:boolean = true

    eventMap: any = [
        [this.left, "click", this.toggle],
        [this.right, "click", this.toggle]
    ]




    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.linkEvents(this.eventMap)
    }



    private toggle(e?:Event):void{
        if(this.freeze){    return    }
        if(!this._checked){
            this.left.className = LeftON
            this.right.className = RightON
            this._checked = true
        }
        else{
            this.left.className = LeftOFF
            this.right.className = RightOFF
            this._checked = false

        }
        if(this.changeEvent){    this.dispatchEvent("change", this)    }
        else{    this.changeEvent = true    }
    }




    set checked(checked:boolean){
        if(checked != this._checked){
            this.changeEvent = false
            this.toggle()
        }
    }



    get checked():boolean{
        return(this._checked)
    }
}

