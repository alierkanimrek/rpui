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
    DIV 
        i gid=sw
`


const ON = "fas fa-toggle-on is-size-3 has-text-success"
const OFF = "fas fa-toggle-off is-size-3 has-text-grey-light"





export class Switch extends GHTMLControl {





    sw:HTMLElement
    _checked:boolean = false
    freeze:boolean = false
    changeEvent:boolean = true


    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.sw.addEventListener("click", this.toggle.bind(this))
        this.sw.className = OFF
    }



    private toggle(e?:Event):void{
        if(this.freeze){    return    }
        if(!this._checked){
            this.sw.className = ON
            this._checked = true
        }
        else{
            this.sw.className = OFF
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

